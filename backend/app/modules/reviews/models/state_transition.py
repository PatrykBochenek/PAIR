from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.modules.reviews.models.action import Action
    from app.modules.reviews.models.state import State


class StateTransition(Base):
    __tablename__ = "state_transitions"
    __table_args__ = (UniqueConstraint("from_state_id", "action_id", name="uq_from_state_action"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    from_state_id: Mapped[int] = mapped_column(ForeignKey("states.id"), nullable=False)
    action_id: Mapped[int] = mapped_column(ForeignKey("actions.id"), nullable=False)
    to_state_id: Mapped[int] = mapped_column(ForeignKey("states.id"), nullable=False)

    from_state: Mapped[State] = relationship(
        "State",
        foreign_keys=[from_state_id],
        back_populates="transitions_from",
    )
    action: Mapped[Action] = relationship(
        "Action",
        back_populates="transitions",
    )
    to_state: Mapped[State] = relationship(
        "State",
        foreign_keys=[to_state_id],
        back_populates="transitions_to",
    )
