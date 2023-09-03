from pydantic import BaseModel
from datetime import datetime


class NoteBase(BaseModel):
    title: str
    content: str


class NoteCreate(NoteBase):
    pass


class NoteInDB(NoteBase):
    id: int
    created_date: datetime

    class Config:
        orm_mode = True


class ItemBase(BaseModel):
    name: str
    description: str


class ItemCreate(ItemBase):
    pass


class ItemInDB(ItemBase):
    id: int

    class Config:
        orm_mode = True
