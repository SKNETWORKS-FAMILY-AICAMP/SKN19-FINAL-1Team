"""
사용법:
  python -m app.rag.scripts.vocab_builder \
    --output app/rag/vocab.json \
    --example-limit 20
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import psycopg2
from dotenv import load_dotenv

# 단독 실행(python 파일.py) 시에도 app 패키지를 import할 수 있도록
# 프로젝트 루트를 sys.path에 추가
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.rag.vocab.rules import ACTION_SYNONYMS, CARD_NAME_SYNONYMS, STOPWORDS, VOCAB_GROUPS

ENV_PATH = os.path.join(ROOT_DIR, ".env")
DEFAULT_OUTPUT = os.path.join(ROOT_DIR, "app", "rag", "vocab.json")
_WS_RE = re.compile(r"\s+") # 중복 공백 제거


@dataclass(frozen=True)
class Settings: # vocab 생성 시 사용되는 정규화/샘플링 설정
    lowercase: bool = True  # 키워드 비교 시 소문자 정규화 여부
    min_keyword_len: int = 2  # 최소 키워드 길이
    example_limit: int = 20   # routing_examples 최대 개수


def clean_text(text: str) -> str: # 앞뒤 공백 제거 + 중복 공백을 하나로 정리
    return _WS_RE.sub(" ", text.strip())


def normalize_text(text: str, lowercase: bool) -> str:
    text = clean_text(text)
    return text.lower() if lowercase else text


def load_db_config() -> Dict[str, Any]: # .env에서 DB 접속 정보를 읽어옴
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
        raise ValueError(f"Missing DB settings: {', '.join(missing)}")
    return cfg

#    vocab 키워드로 사용 가능한지 검증
#    너무 짧은 키워드 제외
#    stopword 제외   
#    숫자-only 키워드 제외


def is_valid_keyword(keyword: str, settings: Settings, stopwords_norm: set[str]) -> bool:
    if not keyword:
        return False
    norm = normalize_text(keyword, settings.lowercase)
    if len(norm) < settings.min_keyword_len:
        return False
    if norm in stopwords_norm:
        return False
    if norm.isdigit():
        return False
    return True

# 쿼리 실행 후 첫 번째 컬럼 값을 리스트로 반환
def fetch_distinct(cur, sql: str, params: Optional[Tuple[Any, ...]] = None) -> List[str]:
    cur.execute(sql, params or ())
    return [r[0] for r in cur.fetchall() if r and r[0] is not None]

# DB에서 가져온 title을 정제 + 중복 제거
def build_examples(raw: List[str]) -> List[str]:
    seen, out = set(), []
    for x in raw:
        t = clean_text(str(x))
        if not t or t in seen:
            continue
        seen.add(t)
        out.append(t)
    return out

#     동의어 사전을 기반으로 routing_examples 우선 선정을 위한 기준 단어 세트 생성
def build_focus_terms(syn_map: Dict[str, List[str]], settings: Settings) -> Dict[str, List[str]]:
    out: Dict[str, List[str]] = {}
    for canonical, terms in syn_map.items():
        all_terms = [canonical, *terms]
        out[canonical] = [normalize_text(t, settings.lowercase) for t in all_terms if t]
    return out

#     routing_examples 생성 로직 
#     동의어(focus term)가 포함된 title을 우선 선택
#     최대 example_limit 개수까지 샘플링

def select_examples(examples: List[str], focus: Dict[str, List[str]], settings: Settings) -> List[str]:
    limit = settings.example_limit
    if limit <= 0:
        return []

    normalized = [(ex, normalize_text(ex, settings.lowercase)) for ex in examples]
    selected, seen = [], set()

    if focus:
        per_term = max(1, limit // len(focus))
        for terms in focus.values():
            if len(selected) >= limit:
                break
            cnt = 0
            for ex, ex_norm in normalized:
                if ex in seen:
                    continue
                if any(t and t in ex_norm for t in terms):
                    selected.append(ex)
                    seen.add(ex)
                    cnt += 1
                    if cnt >= per_term or len(selected) >= limit:
                        break

    for ex, _ in normalized:
        if len(selected) >= limit:
            break
        if ex not in seen:
            selected.append(ex)
            seen.add(ex)

    return selected

#     vocab_rules(VOCAB_GROUPS)를 기반으로 최종 vocab keyword 엔트리 생성
#     중복 제거
#     filter(metadata) 정보 포함

def build_vocab_keywords(settings: Settings) -> List[Dict[str, Any]]:
    stopwords_norm = {normalize_text(w, settings.lowercase) for w in STOPWORDS}
    seen = set()
    out: List[Dict[str, Any]] = []

    for group in VOCAB_GROUPS:
        g_type = group["type"]
        route = group["route"]
        cooldown = group["cooldown_sec"]
        filter_key = group.get("filter_key")
        synonyms: Dict[str, List[str]] = group["synonyms"]

        for canonical, terms in synonyms.items():
            canonical_clean = clean_text(str(canonical))
            for term in [canonical_clean, *terms]:
                keyword = clean_text(str(term))
                if not is_valid_keyword(keyword, settings, stopwords_norm):
                    continue

                dedupe = (normalize_text(keyword, settings.lowercase), canonical_clean, g_type, route)
                if dedupe in seen:
                    continue
                seen.add(dedupe)

                item: Dict[str, Any] = {
                    "keyword": keyword,
                    "canonical": canonical_clean,
                    "type": g_type,
                    "route": route,
                    "cooldown_sec": cooldown,
                }
                if filter_key:
                    item["filters"] = {filter_key: canonical_clean}
                out.append(item)

    out.sort(key=lambda x: (x["type"], x["route"], x["canonical"], x["keyword"]))
    return out

# DB 테이블별로 추출할 쿼리와 라벨 정의
def build_payload(include_notices: bool, settings: Settings) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    queries = {
        "card_tbl": [
            ("SELECT DISTINCT metadata->>'title' FROM card_tbl WHERE metadata ? 'title' ORDER BY 1;", None)
        ],
        "guide_tbl": [
            ("SELECT DISTINCT metadata->>'title' FROM guide_tbl WHERE metadata ? 'title' ORDER BY 1;", None)
        ],
    }
    if include_notices:
        queries["notices"] = [("SELECT DISTINCT title FROM notices WHERE title IS NOT NULL ORDER BY 1;", None)]

    cfg = load_db_config()
    focus = {
        "card_tbl": build_focus_terms(CARD_NAME_SYNONYMS, settings),
        "guide_tbl": build_focus_terms(ACTION_SYNONYMS, settings),
    }

    with psycopg2.connect(**cfg) as conn:
        with conn.cursor() as cur:
            routing_examples: Dict[str, List[str]] = {}
            for label, qlist in queries.items():
                raw: List[str] = []
                for sql, params in qlist:
                    raw.extend(fetch_distinct(cur, sql, params))
                examples = build_examples(raw)
                routing_examples[label] = select_examples(examples, focus.get(label, {}), settings)

    vocab_keywords = build_vocab_keywords(settings)
    payload = {
        "routing_examples": routing_examples,
        "vocab_keywords": vocab_keywords,
        "stopwords": sorted(STOPWORDS),
    }
    stats = {"routing_examples": {k: len(v) for k, v in routing_examples.items()}, "vocab_keywords": len(vocab_keywords)}
    return payload, stats


def main() -> None:
    load_dotenv(ENV_PATH)

    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default=DEFAULT_OUTPUT)
    parser.add_argument("--include-notices", action="store_true")
    parser.add_argument("--example-limit", type=int, default=Settings().example_limit)
    args = parser.parse_args()

    settings = Settings(example_limit=args.example_limit)
    payload, stats = build_payload(args.include_notices, settings)

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2, sort_keys=True)

    print("vocab saved:", args.output)
    for k, v in stats["routing_examples"].items():
        print(f"- routing_examples[{k}]: {v}")
    print(f"- vocab_keywords: {stats['vocab_keywords']}")


if __name__ == "__main__":
    main()
