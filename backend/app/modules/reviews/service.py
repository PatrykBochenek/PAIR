from __future__ import annotations

from typing import ClassVar

from sqlalchemy.orm import Session

from app.core.exceptions import InvalidTransitionError, ItemNotFoundError
from app.core.fsm import BaseFSMAction
from app.modules.reviews.actions import ApproveAction, ClaimAction, EscalateAction, RejectAction
from app.modules.reviews.interface import ReviewsDAOInterface
from app.modules.reviews.models.review_item import ReviewItem


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

    def get_queue(self) -> list[ReviewItem]:
        return self._dao.get_queue()

    def get_item(self, item_id: str) -> ReviewItem:
        item = self._dao.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundError(f"Review item {item_id!r} not found.")
        return item

    def perform_action(self, item_id: str, action_name: str, reviewer: str) -> ReviewItem:
        action = self._actions.get(action_name)
        if action is None:
            raise InvalidTransitionError(f"Unknown action {action_name!r}.")
        item = self.get_item(item_id)
        return action.apply(item, reviewer, self._db, self._dao)
