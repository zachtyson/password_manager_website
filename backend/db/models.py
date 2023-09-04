from sqlalchemy import Column, Integer, String, DateTime, func, MetaData, create_engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)  # Use a larger integer data type if needed
    username = Column(String(30), index=True, unique=True)
    email = Column(String(100), index=True, unique=True)
    hashed_password = Column(String(100))
    created_date = Column(DateTime, default=func.now(), nullable=False)
