"""Safe, idempotent database schema migrations and verification."""

import re
from contextlib import contextmanager
from sqlalchemy import inspect, text

MIGRATION_LOCK_ID = 73910421

# Explicit ordered list of additive, non-destructive column migrations.
# Format: (table_name, column_name, postgres_ddl, sqlite_ddl, backfill_sql_by_dialect)
SCHEMA_MIGRATIONS = [
    (
        "users",
        "phone",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);",
        "ALTER TABLE users ADD COLUMN phone VARCHAR(50);",
        None,
    ),
    (
        "users",
        "location",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(150);",
        "ALTER TABLE users ADD COLUMN location VARCHAR(150);",
        None,
    ),
    (
        "assessment_submissions",
        "attempt_count",
        "ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS attempt_count INTEGER NOT NULL DEFAULT 1;",
        "ALTER TABLE assessment_submissions ADD COLUMN attempt_count INTEGER DEFAULT 1;",
        {
            "postgresql": "UPDATE assessment_submissions SET attempt_count = 1 WHERE attempt_count IS NULL;",
            "sqlite": "UPDATE assessment_submissions SET attempt_count = 1 WHERE attempt_count IS NULL;",
        },
    ),
    (
        "assessment_submissions",
        "history",
        "ALTER TABLE assessment_submissions ADD COLUMN IF NOT EXISTS history JSON DEFAULT '[]'::json;",
        "ALTER TABLE assessment_submissions ADD COLUMN history JSON DEFAULT '[]';",
        {
            "postgresql": "UPDATE assessment_submissions SET history = '[]'::json WHERE history IS NULL;",
            "sqlite": "UPDATE assessment_submissions SET history = '[]' WHERE history IS NULL;",
        },
    ),
]


def sanitize_db_error(exc: Exception) -> str:
    """Scrub embedded credentials or tokens from database exception messages."""
    raw = str(exc or "Unknown database error")
    sanitized = re.sub(
        r"([a-zA-Z0-9_+.-]+://)[^:@\s]+:[^@\s]+@",
        r"\1***:***@",
        raw,
    )
    sanitized = re.sub(
        r"(password|token|secret)=[^\s&;]+",
        r"\1=***",
        sanitized,
        flags=re.IGNORECASE,
    )
    return sanitized


@contextmanager
def migration_lock(engine):
    """Acquire a PostgreSQL session advisory lock to serialize concurrent worker startups."""
    if engine.dialect.name != "postgresql":
        yield
        return

    lock_conn = engine.connect()
    try:
        lock_conn.execute(text(f"SELECT pg_advisory_lock({MIGRATION_LOCK_ID})"))
        yield
    finally:
        try:
            lock_conn.execute(text(f"SELECT pg_advisory_unlock({MIGRATION_LOCK_ID})"))
        finally:
            lock_conn.close()


def run_migrations(app, db) -> list[str]:
    """
    Apply all missing idempotent column migrations without touching existing rows.
    Returns a list of columns added during this run.
    """
    applied = []
    dialect = db.engine.dialect.name
    inspector = inspect(db.engine)
    existing_tables = set(inspector.get_table_names())

    with db.engine.begin() as conn:
        for table_name, col_name, pg_ddl, sqlite_ddl, backfill_map in SCHEMA_MIGRATIONS:
            if table_name not in existing_tables:
                continue

            existing_cols = {c["name"] for c in inspector.get_columns(table_name)}
            if col_name in existing_cols:
                continue

            ddl = pg_ddl if dialect == "postgresql" else sqlite_ddl
            conn.execute(text(ddl))
            if backfill_map and dialect in backfill_map:
                conn.execute(text(backfill_map[dialect]))

            applied.append(f"{table_name}.{col_name}")

    if applied:
        app.logger.info(f"Applied database schema migrations: {', '.join(applied)}")
    return applied


def verify_schema(db) -> None:
    """
    Confirm every table and column defined on registered SQLAlchemy models exists
    in the live database. Raises RuntimeError on schema drift.
    """
    inspector = inspect(db.engine)
    db_tables = set(inspector.get_table_names())

    for table_name, table_obj in db.Model.metadata.tables.items():
        if table_name not in db_tables:
            raise RuntimeError(f"Missing required database table '{table_name}'.")

        actual_cols = {c["name"] for c in inspector.get_columns(table_name)}
        expected_cols = {col.name for col in table_obj.columns}
        missing = sorted(expected_cols - actual_cols)
        if missing:
            raise RuntimeError(
                f"Schema drift detected on table '{table_name}': missing column(s) {', '.join(missing)}."
            )
