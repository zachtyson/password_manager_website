from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData
from databases import Database
import os

DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL environment variable is not set.")
DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://")

# Create the engine
engine = create_engine(DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a databases.Database instance
database = Database(DATABASE_URL)

# Define the metadata
metadata = MetaData()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
