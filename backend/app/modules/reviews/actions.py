from __future__ import annotations

from app.core.fsm import BaseFSMAction


class ClaimAction(BaseFSMAction):
    action_name = "claim"

    def _assigned_reviewer(self, reviewer: str) -> str | None:
        return reviewer


class ApproveAction(BaseFSMAction):
    action_name = "approve"


class RejectAction(BaseFSMAction):
    action_name = "reject"


class EscalateAction(BaseFSMAction):
    action_name = "escalate"
