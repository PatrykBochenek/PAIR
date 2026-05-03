from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.modules.reviews.models.state_transition import StateTransition


class State(Base):
    __tablename__ = "states"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    is_terminal: Mapped[bool] = mapped_column(default=False, nullable=False)

    transitions_from: Mapped[list[StateTransition]] = relationship(
        "StateTransition",
        foreign_keys="StateTransition.from_state_id",
        back_populates="from_state",
    )
    transitions_to: Mapped[list[StateTransition]] = relationship(
        "StateTransition",
        foreign_keys="StateTransition.to_state_id",
        back_populates="to_state",
    )
