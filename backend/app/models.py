from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum

class VisibilityEnum(str, Enum):
    draft = "draft"
    published = "published"

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    releases: List["Release"] = Relationship(back_populates="user")

class UserCreate(SQLModel):
    email: str
    password: str

class UserRead(SQLModel):
    id: int
    email: str
    created_at: datetime

class ReleaseBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    version: str = Field(min_length=1, max_length=50)
    content_md: str = ""
    visibility: VisibilityEnum = Field(default=VisibilityEnum.draft)

class Release(ReleaseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    slug: Optional[str] = Field(default=None, index=True)
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="releases")

class ReleaseCreate(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    version: str = Field(min_length=1, max_length=50)
    content_md: str = ""
    visibility: VisibilityEnum = Field(default=VisibilityEnum.draft)

class ReleaseUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    version: Optional[str] = Field(default=None, min_length=1, max_length=50)
    content_md: Optional[str] = None
    visibility: Optional[VisibilityEnum] = None

class ReleaseRead(SQLModel):
    id: int
    title: str
    version: str
    slug: Optional[str]
    content_md: str
    visibility: VisibilityEnum
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    user_id: int

class ReleasePublic(SQLModel):
    id: int
    title: str
    version: str
    slug: Optional[str]
    content_md: str
    published_at: Optional[datetime]

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(SQLModel):
    email: str
    password: str
