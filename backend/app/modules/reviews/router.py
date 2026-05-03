from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.exceptions import InvalidTransitionError, ItemNotFoundError, TerminalStateError
from app.modules.reviews.dependencies import get_review_service
from app.modules.reviews.schemas import ActionRequest, ErrorOut, ReviewItemOut
from app.modules.reviews.service import ReviewService

router = APIRouter(prefix="/reviews", tags=["reviews"])

ServiceDep = Annotated[ReviewService, Depends(get_review_service)]


@router.get(
    "/queue",
    response_model=list[ReviewItemOut],
    summary="Active review queue ordered by urgency",
)
def get_queue(service: ServiceDep) -> list[ReviewItemOut]:
    return service.get_queue()


@router.get(
    "/{item_id}",
    response_model=ReviewItemOut,
    responses={404: {"model": ErrorOut}},
    summary="Fetch a single review item by ID",
)
def get_item(item_id: str, service: ServiceDep) -> ReviewItemOut:
    try:
        return service.get_item(item_id)
    except ItemNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post(
    "/{item_id}/actions/{action}",
    response_model=ReviewItemOut,
    responses={
        404: {"model": ErrorOut},
        422: {"model": ErrorOut},
    },
    summary="Perform a workflow action on a review item",
)
def perform_action(
    item_id: str,
    action: str,
    body: ActionRequest,
    service: ServiceDep,
) -> ReviewItemOut:
    try:
        return service.perform_action(item_id, action, body.reviewer)
    except ItemNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except (TerminalStateError, InvalidTransitionError) as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)
        ) from exc
