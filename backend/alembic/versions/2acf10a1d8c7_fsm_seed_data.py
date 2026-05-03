"""fsm_seed_data

Revision ID: 2acf10a1d8c7
Revises: 8aeb3071352e
Create Date: 2026-05-03 19:38:00.000000

"""

from pathlib import Path

from alembic import op

revision: str = "2acf10a1d8c7"
down_revision: str | None = "8aeb3071352e"
branch_labels: str | None = None
depends_on: str | None = None

SEED_FILE = Path(__file__).parent.parent / "seeds" / "001_fsm_seed.sql"


def upgrade() -> None:
    sql = SEED_FILE.read_text()
    for statement in sql.split(";"):
        lines = [line for line in statement.splitlines() if not line.strip().startswith("--")]
        statement = "\n".join(lines).strip()
        if statement:
            op.execute(statement)


def downgrade() -> None:
    op.execute("DELETE FROM state_transitions")
    op.execute("DELETE FROM actions")
    op.execute("DELETE FROM states")
