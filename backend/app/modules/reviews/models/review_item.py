from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.modules.reviews.models.state import State


class ReviewItem(Base):
    __tablename__ = "review_items"

    id: Mapped[str] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    risk_level: Mapped[str] = mapped_column(nullable=False)
    customer_tier: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(ForeignKey("states.name"), nullable=False)
    assigned_reviewer: Mapped[str | None] = mapped_column(nullable=True)
    notes_count: Mapped[int] = mapped_column(default=0, nullable=False)
    summary: Mapped[str] = mapped_column(nullable=False)

    state: Mapped[State] = relationship("State", foreign_keys=[status])
