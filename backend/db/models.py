from sqlalchemy import Column, Integer, String, DateTime, func, MetaData, create_engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True)
    title = Column(String(50))
    content = Column(String(200))
    created_date = Column(DateTime, default=func.now(), nullable=False)


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True)
    name = Column(String(30))
    description = Column(String(100))
