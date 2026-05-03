.PHONY: dev lint fmt typecheck migrate

dev:
	uv run uvicorn app.main:app --reload --port 8000

lint:
	uv run ruff check app/

fmt:
	uv run ruff format app/

typecheck:
	uv run mypy app/

migrate:
	uv run alembic upgrade head
