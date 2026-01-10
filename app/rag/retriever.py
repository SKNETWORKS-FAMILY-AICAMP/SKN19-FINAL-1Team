from typing import Dict, List, Optional, Tuple

import os
import re
import json

import psycopg2
from dotenv import load_dotenv
from pgvector import Vector
from pgvector.psycopg2 import register_vector

from app.llm.base import get_openai_client
from app.rag.router import route_query as _route_query
from app.rag.vocab.rules import ACTION_SYNONYMS, CARD_NAME_SYNONYMS, PAYMENT_SYNONYMS, STOPWORDS, WEAK_INTENT_SYNONYMS

load_dotenv()

RRF_K = 60
QUERY_TITLE_WEIGHT = 2
QUERY_CONTENT_WEIGHT = 1
CARD_META_WEIGHT = 3
TITLE_SCORE_WEIGHT = 0.001


def route_query(query: str) -> Dict[str, Optional[object]]:
    return _route_query(query)


def _as_list(value: Optional[object]) -> List[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    return [item for item in value if item]


def _unique_in_order(items: List[str]) -> List[str]:
    seen = set()
    out = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def _expand_no_space_terms(terms: List[str]) -> List[str]:
    out = []
    for term in terms:
        compact = term.replace(" ", "")
        if compact and compact != term:
            out.append(compact)
    return out


def _expand_payment_terms(terms: List[str]) -> List[str]:
    expanded = []
    for canonical in terms:
        expanded.extend(PAYMENT_SYNONYMS.get(canonical, []))
    combined = _unique_in_order([*terms, *expanded])
    return _unique_in_order([*combined, *_expand_no_space_terms(combined)])


def _expand_card_terms(terms: List[str]) -> List[str]:
    expanded = []
    for canonical in terms:
        expanded.extend(CARD_NAME_SYNONYMS.get(canonical, []))
    return _unique_in_order([*terms, *expanded])


def _expand_action_terms(terms: List[str]) -> List[str]:
    expanded = []
    for canonical in terms:
        expanded.extend(ACTION_SYNONYMS.get(canonical, []))
    return _unique_in_order([*terms, *expanded])


def _expand_weak_terms(terms: List[str]) -> List[str]:
    expanded = []
    for canonical in terms:
        expanded.extend(WEAK_INTENT_SYNONYMS.get(canonical, []))
    return _unique_in_order([*terms, *expanded])


def _title_match_score(title: Optional[str], terms: List[str], weight: int) -> int:
    if not title:
        return 0
    lowered = title.lower()
    score = 0
    for term in terms:
        if term and term.lower() in lowered:
            score += weight
    return score


def _content_match_score(content: str, terms: List[str], weight: int) -> int:
    if not content:
        return 0
    lowered = content.lower()
    score = 0
    for term in terms:
        if term and term.lower() in lowered:
            score += weight
    return score


def _card_meta_score(metadata: Dict[str, object], card_values: List[str]) -> int:
    if not card_values:
        return 0
    card_name = metadata.get("card_name")
    if not card_name:
        return 0
    card_name_str = str(card_name)
    card_name_norm = card_name_str.replace(" ", "")
    for value in card_values:
        value_str = str(value)
        if card_name_str == value_str:
            return CARD_META_WEIGHT
        if card_name_norm == value_str.replace(" ", ""):
            return CARD_META_WEIGHT
    return 0


def _card_term_match(title: Optional[str], content: str, card_terms: List[str]) -> bool:
    if card_terms and _title_match_score(title, card_terms, 1) > 0:
        return True
    if card_terms and _content_match_score(content, card_terms, 1) > 0:
        return True
    return False


def _build_like_group(terms: List[str], params: List[str]) -> Optional[str]:
    if not terms:
        return None
    term_clauses = []
    for term in terms:
        term_clauses.append("(content ILIKE %s OR metadata->>'title' ILIKE %s)")
        params.extend([f"%{term}%", f"%{term}%"])
    return "(" + " OR ".join(term_clauses) + ")"


def _build_query_text(query: str, query_template: Optional[str]) -> str:
    if query_template:
        merged = f"{query_template} {query}".strip()
        return merged or query
    return query


_TERM_WS_RE = re.compile(r"\s+")


def _extract_query_terms(query: str) -> List[str]:
    text = _TERM_WS_RE.sub(" ", query.strip().lower())
    raw_terms = [term for term in text.split(" ") if term]
    stopwords = {word.lower() for word in STOPWORDS}
    terms = []
    for term in raw_terms:
        if term.isdigit():
            continue
        if len(term) < 2:
            continue
        if term in stopwords:
            continue
        terms.append(term)
    return _unique_in_order(terms)


def _parse_json_content(content: str) -> Dict[str, object]:
    if not content:
        return {}
    text = content.lstrip()
    if text.startswith("{") or text.startswith("["):
        try:
            data = json.loads(text)
            if isinstance(data, list):
                data = data[0] if data else {}
            if isinstance(data, dict):
                return data
        except Exception:
            return {}
    return {}


def _extract_json_value(content: str, key: str) -> Optional[str]:
    if not content:
        return None
    match = re.search(rf'"{re.escape(key)}"\\s*:\\s*"([^"]+)"', content)
    if not match:
        return None
    value = match.group(1)
    return value.replace("\\n", "\n")


def _normalize_doc_fields(
    content: str,
    metadata: Optional[object],
) -> Tuple[Optional[str], str, Dict[str, object]]:
    meta = metadata if isinstance(metadata, dict) else {}
    title = meta.get("title")
    normalized_content = content or ""
    id_candidate: Optional[str] = None

    if not title:
        parsed = _parse_json_content(normalized_content)
        if parsed:
            if not title:
                title = parsed.get("title") or (parsed.get("metadata") or {}).get("title")
            if not id_candidate:
                id_candidate = parsed.get("id") or (parsed.get("metadata") or {}).get("id")
            body = parsed.get("content") or parsed.get("text")
            if isinstance(body, str) and body:
                normalized_content = body
            parsed_meta = parsed.get("metadata")
            if isinstance(parsed_meta, dict):
                meta = {**parsed_meta, **meta}
        else:
            title = _extract_json_value(normalized_content, "title") or title
            body = _extract_json_value(normalized_content, "content")
            if not body:
                body = _extract_json_value(normalized_content, "text")
            if body:
                normalized_content = body
            if not id_candidate:
                id_candidate = _extract_json_value(normalized_content, "id")

    if not meta.get("id") and id_candidate:
        meta["id"] = id_candidate

    return title, normalized_content, meta


def build_where_clause(
    filters: Optional[Dict[str, object]],
    table: str,
) -> Tuple[str, List[str]]:
    filters = filters or {}
    clauses: List[str] = []
    params: List[str] = []
    has_category = False

    for key in ("category1", "category2"):
        values = _as_list(filters.get(key))
        if not values:
            continue
        placeholders = ", ".join(["%s"] * len(values))
        clauses.append(f"metadata->>'{key}' IN ({placeholders})")
        params.extend(values)
        has_category = True

    card_values = _as_list(filters.get("card_name"))
    card_terms = _expand_card_terms(card_values)
    intent_terms = _expand_action_terms(_as_list(filters.get("intent")))
    payment_terms = _expand_payment_terms(_as_list(filters.get("payment_method")))
    has_intent = bool(intent_terms) or bool(_as_list(filters.get("weak_intent")))

    if table == "guide_tbl":
        pass
    else:
        card_meta_clause = None
        if card_values:
            placeholders = ", ".join(["%s"] * len(card_values))
            card_meta_clause = f"(metadata->>'card_name' IN ({placeholders}))"
            params.extend(card_values)
        card_group = _build_like_group(card_terms, params)
        payment_group = None
        if not card_group and not card_meta_clause:
            payment_only = payment_terms and not has_intent and not has_category
            if payment_only:
                payment_group = None
            else:
                payment_group = _build_like_group(payment_terms, params)
        if card_meta_clause and card_group:
            clauses.append(f"({card_meta_clause} OR {card_group})")
        elif card_meta_clause:
            clauses.append(card_meta_clause)
        elif card_group:
            clauses.append(card_group)
        if payment_group:
            clauses.append(payment_group)

    if not clauses:
        return "", []
    return " WHERE " + " AND ".join(clauses), params


def _db_config() -> Dict[str, object]:
    host = os.getenv("DB_HOST_IP") or os.getenv("DB_HOST")
    cfg = {
        "host": host,
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "port": int(os.getenv("DB_PORT", "0")) or None,
    }
    missing = [k for k, v in cfg.items() if not v]
    if missing:
        raise ValueError(f"Missing DB settings: {missing}")
    return cfg


def _safe_table(name: str) -> str:
    if name not in ("card_tbl", "guide_tbl"):
        raise ValueError(f"Unsupported table: {name}")
    return name


def _choose_table(filters: Dict[str, object]) -> str:
    if filters.get("card_name"):
        return "card_tbl"
    if filters.get("intent") or filters.get("weak_intent"):
        return "guide_tbl"
    return "card_tbl"


def embed_query(text: str, model: str = "text-embedding-3-small") -> List[float]:
    client = get_openai_client()
    resp = client.embeddings.create(model=model, input=text)
    return resp.data[0].embedding


def vector_search(
    query: str,
    table: str,
    limit: int,
    filters: Optional[Dict[str, object]] = None,
) -> List[Tuple[object, str, Dict[str, object], float]]:
    table = _safe_table(table)
    emb = Vector(embed_query(query))
    where_sql, where_params = build_where_clause(filters, table)
    with psycopg2.connect(**_db_config()) as conn:
        register_vector(conn)
        with conn.cursor() as cur:
            sql = (
                f"SELECT id, content, metadata, 1 - (embedding <=> %s) AS score "
                f"FROM {table}{where_sql} ORDER BY embedding <=> %s LIMIT %s"
            )
            params = [emb, *where_params, emb, limit]
            try:
                cur.execute(sql, params)
            except Exception:
                conn.rollback()
                sql = (
                    f"SELECT id, content, metadata, 1 - (embedding <-> %s) AS score "
                    f"FROM {table}{where_sql} ORDER BY embedding <-> %s LIMIT %s"
                )
                cur.execute(sql, params)
            return cur.fetchall()


def text_search(
    table: str,
    terms: List[str],
    limit: int,
) -> List[Tuple[object, str, Dict[str, object], float]]:
    if not terms:
        return []
    table = _safe_table(table)
    params: List[str] = []
    where_sql = _build_like_group(terms, params)
    if not where_sql:
        return []
    with psycopg2.connect(**_db_config()) as conn:
        with conn.cursor() as cur:
            sql = f"SELECT id, content, metadata, 0.0 AS score FROM {table} WHERE {where_sql} LIMIT %s"
            params.append(limit)
            cur.execute(sql, params)
            return cur.fetchall()


def _build_candidates_from_rows(
    vec_rows: List[Tuple[object, str, Dict[str, object], float]],
    kw_rows: List[Tuple[object, str, Dict[str, object], float]],
    table: str,
    card_values: List[str],
    card_terms: List[str],
    rank_terms: List[str],
    query_terms: List[str],
) -> List[Tuple[int, float, Dict[str, object]]]:
    vec_rank: Dict[str, int] = {}
    kw_rank: Dict[str, int] = {}
    vec_docs: Dict[str, Dict[str, object]] = {}
    kw_docs: Dict[str, Dict[str, object]] = {}

    for idx, (doc_id, content, metadata, score) in enumerate(vec_rows, 1):
        key = f"{table}:{doc_id}"
        if key in vec_docs:
            continue
        title, normalized_content, normalized_meta = _normalize_doc_fields(content, metadata)
        output_id = normalized_meta.get("id") or doc_id
        vec_docs[key] = {
            "id": str(output_id) if output_id is not None else "",
            "db_id": doc_id,
            "title": title,
            "content": normalized_content,
            "metadata": normalized_meta,
            "vector_score": float(score),
            "table": table,
        }
        vec_rank[key] = idx

    for idx, (doc_id, content, metadata, _) in enumerate(kw_rows, 1):
        key = f"{table}:{doc_id}"
        if key in kw_docs:
            continue
        title, normalized_content, normalized_meta = _normalize_doc_fields(content, metadata)
        output_id = normalized_meta.get("id") or doc_id
        kw_docs[key] = {
            "id": str(output_id) if output_id is not None else "",
            "db_id": doc_id,
            "title": title,
            "content": normalized_content,
            "metadata": normalized_meta,
            "vector_score": 0.0,
            "table": table,
        }
        kw_rank[key] = idx

    candidates: List[Tuple[int, float, Dict[str, object]]] = []
    for key in set(vec_docs.keys()) | set(kw_docs.keys()):
        doc = vec_docs.get(key) or kw_docs.get(key)
        if not doc:
            continue
        rrf_score = 0.0
        if key in vec_rank:
            rrf_score += 1.0 / (RRF_K + vec_rank[key])
        if key in kw_rank:
            rrf_score += 1.0 / (RRF_K + kw_rank[key])
        title = doc.get("title")
        card_meta_score = _card_meta_score(doc.get("metadata") or {}, card_values)
        title_score = _title_match_score(title, card_terms, 2)
        title_score += _title_match_score(title, rank_terms, 1)
        title_score += _title_match_score(title, query_terms, QUERY_TITLE_WEIGHT)
        title_score += _content_match_score(doc.get("content") or "", query_terms, QUERY_CONTENT_WEIGHT)
        title_score += card_meta_score
        doc["card_meta_score"] = card_meta_score
        doc["card_match"] = card_meta_score > 0 or _card_term_match(
            title,
            doc.get("content") or "",
            card_terms,
        )
        final_score = rrf_score + (title_score * TITLE_SCORE_WEIGHT)
        doc["score"] = final_score
        doc["rrf_score"] = rrf_score
        doc["title_score"] = title_score
        candidates.append((title_score, rrf_score, doc))

    return candidates


def _build_search_context(
    query: str,
    routing: Dict[str, object],
) -> Dict[str, object]:
    query_text = _build_query_text(query, routing.get("query_template"))
    filters = routing.get("filters") or {}

    card_values = _as_list(filters.get("card_name"))
    card_terms = _expand_card_terms(card_values)
    intent_terms = _expand_action_terms(_as_list(filters.get("intent")))
    weak_terms = _expand_weak_terms(_as_list(filters.get("weak_intent")))
    payment_terms = _expand_payment_terms(_as_list(filters.get("payment_method")))
    query_terms = _extract_query_terms(query)
    rank_terms = _unique_in_order([*intent_terms, *payment_terms, *weak_terms, *query_terms])
    payment_only = bool(payment_terms) and not card_terms and not intent_terms
    payment_norm = {term.lower().replace(" ", "") for term in payment_terms}
    extra_terms = [
        term
        for term in query_terms
        if term.lower().replace(" ", "") not in payment_norm
    ]

    return {
        "query_text": query_text,
        "filters": filters,
        "card_values": card_values,
        "card_terms": card_terms,
        "intent_terms": intent_terms,
        "weak_terms": weak_terms,
        "payment_terms": payment_terms,
        "query_terms": query_terms,
        "rank_terms": rank_terms,
        "payment_only": payment_only,
        "extra_terms": extra_terms,
    }


def _fetch_k(top_k: int) -> int:
    return max(top_k * 3, top_k + 5)


def _keyword_rows(
    table: str,
    context: Dict[str, object],
    limit: int,
) -> List[Tuple[object, str, Dict[str, object], float]]:
    if not context["payment_only"] or not context["extra_terms"]:
        return []
    return text_search(table=table, terms=context["extra_terms"], limit=limit)


def _collect_candidates(
    table: str,
    vec_rows: List[Tuple[object, str, Dict[str, object], float]],
    context: Dict[str, object],
    limit: int,
) -> List[Tuple[int, float, Dict[str, object]]]:
    return _build_candidates_from_rows(
        vec_rows=vec_rows,
        kw_rows=_keyword_rows(table, context, limit),
        table=table,
        card_values=context["card_values"],
        card_terms=context["card_terms"],
        rank_terms=context["rank_terms"],
        query_terms=context["query_terms"],
    )


def _finalize_candidates(
    candidates: List[Tuple[int, float, Dict[str, object]]],
    key_fn,
) -> List[Dict[str, object]]:
    candidates.sort(key=lambda item: (item[0], item[1]), reverse=True)
    has_card_match = any(doc.get("card_match") for _, _, doc in candidates)
    if has_card_match:
        candidates = [item for item in candidates if item[2].get("card_match")]

    best_by_title: Dict[str, Tuple[Tuple[int, float], Dict[str, object]]] = {}
    for _, score, doc in candidates:
        key = key_fn(doc)
        content_len = len(doc.get("content") or "")
        rank_key = (content_len, score)
        existing = best_by_title.get(key)
        if not existing or rank_key > existing[0]:
            best_by_title[key] = (rank_key, doc)

    docs = [item[1] for item in best_by_title.values()]
    docs.sort(key=lambda item: (item.get("title_score", 0), item.get("score", 0.0)), reverse=True)
    return docs


async def retrieve_docs(
    query: str,
    routing: Dict[str, object],
    top_k: int = 5,
    table: Optional[str] = None,
    allow_fallback: bool = True,
) -> List[Dict[str, object]]:
    tables = ["card_tbl", "guide_tbl"] if table is None else [_safe_table(table)]
    if allow_fallback and table == "card_tbl":
        if "guide_tbl" not in tables:
            tables.append("guide_tbl")
    return await retrieve_multi(query=query, routing=routing, tables=tables, top_k=top_k)


async def retrieve_multi(
    query: str,
    routing: Dict[str, object],
    tables: List[str],
    top_k: int = 5,
) -> List[Dict[str, object]]:
    context = _build_search_context(query, routing)
    fetch_k = _fetch_k(top_k)
    candidates: List[Tuple[int, float, Dict[str, object]]] = []

    for table in tables:
        safe_table = _safe_table(table)
        rows = vector_search(context["query_text"], table=safe_table, limit=fetch_k, filters=context["filters"])
        if (
            safe_table == "card_tbl"
            and context["card_terms"]
            and not context["intent_terms"]
            and not context["payment_terms"]
        ):
            loose_filters = dict(context["filters"])
            loose_filters.pop("card_name", None)
            loose_rows = vector_search(context["query_text"], table=safe_table, limit=fetch_k, filters=loose_filters)
            if loose_rows:
                rows.extend(loose_rows)
        candidates.extend(_collect_candidates(safe_table, rows, context, fetch_k))

    def _doc_key(doc: Dict[str, object]) -> str:
        title = doc.get("title")
        return title if title else f"__no_title__{doc.get('table')}:{doc.get('id')}"

    docs = _finalize_candidates(candidates, _doc_key)
    return docs[:top_k]
