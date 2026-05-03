.PHONY: dev lint fmt typecheck

dev:
	uv run uvicorn app.main:app --reload --port 8000

lint:
	uv run ruff check app/

fmt:
	uv run ruff format app/

typecheck:
	uv run mypy app/
