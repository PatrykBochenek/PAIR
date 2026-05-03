from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.seeder import seed_review_items
from app.database import SessionLocal


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    db = SessionLocal()
    try:
        seed_review_items(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Reviewer Queue API", lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
