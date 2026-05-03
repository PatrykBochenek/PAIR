from __future__ import annotations

from abc import ABC, abstractmethod

from app.modules.reviews.models.review_item import ReviewItem


class ReviewsDAOInterface(ABC):
    @abstractmethod
    def get_queue(self) -> list[ReviewItem]: ...

    @abstractmethod
    def get_by_id(self, item_id: str) -> ReviewItem | None: ...

    @abstractmethod
    def update_status(
        self,
        item_id: str,
        new_status: str,
        assigned_reviewer: str | None = None,
    ) -> ReviewItem: ...
