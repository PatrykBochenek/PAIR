from __future__ import annotations

from fastapi import Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.modules.reviews.dao import ReviewsDAO
from app.modules.reviews.interface import ReviewsDAOInterface
from app.modules.reviews.service import ReviewService


def get_reviews_dao(db: Session = Depends(get_db)) -> ReviewsDAOInterface:
    return ReviewsDAO(db)


def get_review_service(
    dao: ReviewsDAOInterface = Depends(get_reviews_dao),
    db: Session = Depends(get_db),
) -> ReviewService:
    return ReviewService(dao=dao, db=db)
