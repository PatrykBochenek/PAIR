from __future__ import annotations

from typing import ClassVar

from sqlalchemy.orm import Session

from app.core.exceptions import InvalidTransitionError, ItemNotFoundError
from app.core.fsm import BaseFSMAction, get_allowed_actions
from app.modules.reviews.actions import ApproveAction, ClaimAction, EscalateAction, RejectAction
from app.modules.reviews.interface import ReviewsDAOInterface
from app.modules.reviews.models.review_item import ReviewItem
from app.modules.reviews.schemas import ReviewItemOut


class ReviewService:
    _actions: ClassVar[dict[str, BaseFSMAction]] = {
        "claim": ClaimAction(),
        "approve": ApproveAction(),
        "reject": RejectAction(),
        "escalate": EscalateAction(),
    }

    def __init__(self, dao: ReviewsDAOInterface, db: Session) -> None:
        self._dao = dao
        self._db = db

    def _to_schema(self, item: ReviewItem) -> ReviewItemOut:
        return ReviewItemOut.model_validate(
            {**item.__dict__, "allowed_actions": get_allowed_actions(item.status, self._db)}
        )

    def get_queue(self) -> list[ReviewItemOut]:
        return [self._to_schema(item) for item in self._dao.get_queue()]

    def get_item(self, item_id: str) -> ReviewItemOut:
        item = self._dao.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundError(f"Review item {item_id!r} not found.")
        return self._to_schema(item)

    def perform_action(self, item_id: str, action_name: str, reviewer: str) -> ReviewItemOut:
        action = self._actions.get(action_name)
        if action is None:
            raise InvalidTransitionError(f"Unknown action {action_name!r}.")
        raw_item = self._dao.get_by_id(item_id)
        if raw_item is None:
            raise ItemNotFoundError(f"Review item {item_id!r} not found.")
        updated = action.apply(raw_item, reviewer, self._db, self._dao)
        return self._to_schema(updated)
