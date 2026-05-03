from __future__ import annotations

import json
from datetime import UTC, datetime
from pathlib import Path
from typing import TypedDict

from sqlalchemy.orm import Session

from app.modules.reviews.models.review_item import ReviewItem

REVIEW_ITEMS_FILE = Path(__file__).resolve().parents[3] / "data" / "review_items.json"


class ReviewItemRecord(TypedDict):
    id: str
    title: str
    submitted_at: str
    risk_level: str
    customer_tier: str
    status: str
    assigned_reviewer: str | None
    notes_count: int
    summary: str


def seed_review_items(db: Session) -> None:
    if db.query(ReviewItem).count() > 0:
        return

    records: list[ReviewItemRecord] = json.loads(REVIEW_ITEMS_FILE.read_text())

    for record in records:
        submitted_at = datetime.fromisoformat(record["submitted_at"].replace("Z", "+00:00"))
        if submitted_at.tzinfo is None:
            submitted_at = submitted_at.replace(tzinfo=UTC)

        db.add(
            ReviewItem(
                id=record["id"],
                title=record["title"],
                submitted_at=submitted_at,
                risk_level=record["risk_level"],
                customer_tier=record["customer_tier"],
                status=record["status"],
                assigned_reviewer=record["assigned_reviewer"],
                notes_count=record["notes_count"],
                summary=record["summary"],
            )
        )

    db.commit()
