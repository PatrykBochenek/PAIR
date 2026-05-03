from __future__ import annotations

from sqlalchemy import case, select
from sqlalchemy.orm import Session

from app.modules.reviews.interface import ReviewsDAOInterface
from app.modules.reviews.models.review_item import ReviewItem
from app.modules.reviews.models.state import State

_RISK_ORDER = case(
    {"high": 0, "medium": 1, "low": 2},
    value=ReviewItem.risk_level,
    else_=3,
)

_TIER_ORDER = case(
    {"priority": 0, "standard": 1},
    value=ReviewItem.customer_tier,
    else_=2,
)


class ReviewsDAO(ReviewsDAOInterface):
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_queue(self) -> list[ReviewItem]:
        terminal_names = select(State.name).where(State.is_terminal.is_(True))
        return (
            self._db.query(ReviewItem)
            .filter(ReviewItem.status.not_in(terminal_names))
            .order_by(_RISK_ORDER, _TIER_ORDER, ReviewItem.submitted_at.asc())
            .all()
        )

    def get_by_id(self, item_id: str) -> ReviewItem | None:
        return self._db.get(ReviewItem, item_id)

    def update_status(
        self,
        item_id: str,
        new_status: str,
        assigned_reviewer: str | None = None,
    ) -> ReviewItem:
        item = self._db.get(ReviewItem, item_id)
        if item is None:
            raise ValueError(f"ReviewItem {item_id!r} not found")
        item.status = new_status
        if assigned_reviewer is not None:
            item.assigned_reviewer = assigned_reviewer
        self._db.commit()
        self._db.refresh(item)
        return item
