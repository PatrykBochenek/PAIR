from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReviewItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    submitted_at: datetime
    risk_level: str
    customer_tier: str
    status: str
    assigned_reviewer: str | None
    notes_count: int
    summary: str
    allowed_actions: list[str]


class ActionRequest(BaseModel):
    reviewer: str = "alex"


class ErrorOut(BaseModel):
    detail: str
