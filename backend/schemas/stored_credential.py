from typing import Optional, List
from schemas.user import UserBase
from pydantic import BaseModel
from datetime import datetime


# Base structure for a credential
class CredBase(BaseModel):
    nickname: str


# Used for creating a new stored credential
class CredCreate(CredBase):
    username: str
    email: str
    password: str


class CredInDB(CredBase):
    id: int
    username: Optional[str] = None
    email: Optional[str] = None
    encrypted_password: str
    added_date: datetime
    last_accessed_date: datetime

    class Config:
        orm_mode = True


# Used for updating credential information
class CredUpdate(CredBase):
    nickname: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None


# Used for returning credential information. Does not include email,
# username, or password
class CredResponse(CredBase):
    id: int
    added_date: datetime
    last_accessed_date: datetime
    shared_users: List[UserBase]

    class Config:
        orm_mode = True
