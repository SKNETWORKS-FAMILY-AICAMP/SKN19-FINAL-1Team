import argparse
import asyncio
import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv


def find_repo_root(start: Path) -> Path:
    for p in [start, *start.parents]:
        if (p / "app").exists():
            return p
    raise FileNotFoundError("Could not find repo root with app/ directory")


def load_tests(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    raise ValueError("Test file must be a JSON list")


def summarize(result: dict) -> str:
    titles = []
    for card in result.get("currentSituation", [])[:2]:
        title = card.get("title") or "(no title)"
        titles.append(title)
    return "; ".join(titles)


async def run_case(query: str, config, expect_route, expect_should_route) -> tuple[bool, str, dict]:
    from app.rag.pipeline import run_rag

    result = await run_rag(query, config=config)
    routing = result.get("routing") or {}
    route = routing.get("route")
    should_route = routing.get("should_route")
    ok = True
    if expect_route is not None and route != expect_route:
        ok = False
    if expect_should_route is not None and bool(should_route) != bool(expect_should_route):
        ok = False
    summary = f"route={route} should_route={should_route} top={summarize(result)}"
    return ok, summary, result


async def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--tests",
        default="app/rag/resources/regression_tests.json",
        help="Path to regression test JSON",
    )
    parser.add_argument("--limit", type=int, default=0)
    parser.add_argument("--top-k", type=int, default=4)
    parser.add_argument("--normalize-keywords", action="store_true", default=True)
    parser.add_argument("--strict-guidance-script", action="store_true", default=True)
    args = parser.parse_args()

    root = find_repo_root(Path.cwd().resolve())
    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

    load_dotenv(root / ".env", override=True)
    if os.getenv("OPENAI_API_KEY"):
        os.environ["OPENAI_API_KEY"] = os.environ["OPENAI_API_KEY"].strip()

    from app.rag.pipeline import RAGConfig

    config = RAGConfig(
        top_k=args.top_k,
        normalize_keywords=args.normalize_keywords,
        strict_guidance_script=args.strict_guidance_script,
    )

    tests = load_tests(root / args.tests)
    if args.limit:
        tests = tests[: args.limit]

    failures = 0
    for idx, test in enumerate(tests, 1):
        query = test.get("query", "").strip()
        if not query:
            continue
        ok, summary, _ = await run_case(
            query=query,
            config=config,
            expect_route=test.get("expect_route"),
            expect_should_route=test.get("expect_should_route"),
        )
        status = "PASS" if ok else "FAIL"
        if not ok:
            failures += 1
        print(f"[{status}] {idx:02d}. {query} -> {summary}")

    print(f"Done. total={len(tests)} fail={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
