from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

from sqlalchemy.orm import Session

from app.core.exceptions import InvalidTransitionError, TerminalStateError
from app.modules.reviews.models.action import Action
from app.modules.reviews.models.state import State
from app.modules.reviews.models.state_transition import StateTransition

if TYPE_CHECKING:
    from app.modules.reviews.interface import ReviewsDAOInterface
    from app.modules.reviews.models.review_item import ReviewItem


class BaseFSMAction(ABC):
    @property
    @abstractmethod
    def action_name(self) -> str: ...

    def apply(
        self,
        item: ReviewItem,
        reviewer: str,
        db: Session,
        dao: ReviewsDAOInterface,
    ) -> ReviewItem:
        state = db.query(State).filter(State.name == item.status).first()
        if state is None or state.is_terminal:
            raise TerminalStateError(
                f"Item {item.id!r} is in terminal state {item.status!r} and cannot be actioned."
            )

        transition = (
            db.query(StateTransition)
            .join(Action, StateTransition.action_id == Action.id)
            .filter(
                StateTransition.from_state_id == state.id,
                Action.name == self.action_name,
            )
            .first()
        )
        if transition is None:
            raise InvalidTransitionError(
                f"Action {self.action_name!r} is not allowed from state {item.status!r}."
            )

        new_state = db.get(State, transition.to_state_id)
        if new_state is None:
            raise InvalidTransitionError("Transition points to a non-existent state.")

        return dao.update_status(
            item.id,
            new_state.name,
            assigned_reviewer=self._assigned_reviewer(reviewer),
        )

    def _assigned_reviewer(self, reviewer: str) -> str | None:
        return None
