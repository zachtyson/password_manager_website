from typing import Optional, List
from schemas.user import UserBase
from pydantic import BaseModel
from datetime import datetime


# Base structure for a credential
class CredBase(BaseModel):
    nickname: str


# Used for creating a new stored credential
class CredCreate(CredBase):
    username: Optional[str] = None
    email: Optional[str] = None
    url: Optional[str] = None
    password: str
    salt: str


# Used for getting all information on a credential
class CredInDB(CredBase):
    id: int
    owner_id: int
    username: Optional[str] = None
    email: Optional[str] = None
    url: Optional[str] = None
    encrypted_password: str
    added_date: datetime
    last_accessed_date: datetime
    shared_users: List[UserBase]
    salt: Optional[str] = None

    class Config:
        orm_mode = True


# Used for getting all information on a credential except the list of users shared with
class CredInDBShared(CredBase):
    id: int
    owner_id: int
    username: Optional[str] = None
    email: Optional[str] = None
    url: Optional[str] = None
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
    url: Optional[str] = None


# Used for returning credential information. Does not include email,
# username, or password
class CredResponse(CredBase):
    id: int
    owner_id: int
    added_date: datetime
    last_accessed_date: datetime
    shared_users: List[UserBase]
    url: Optional[str] = None

    class Config:
        orm_mode = True
