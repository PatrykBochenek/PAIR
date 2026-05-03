from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.seeder import seed_review_items
from app.database import SessionLocal
from app.modules.reviews.router import router as reviews_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None]:
    db = SessionLocal()
    try:
        seed_review_items(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Reviewer Queue API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews_router, prefix="/api")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
