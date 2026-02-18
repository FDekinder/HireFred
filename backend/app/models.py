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


# ── Hiring Progress Models ─────────────────────────────────────────────────────

class ApplicationStatus(str, Enum):
    applied = "applied"
    response = "response"
    interview = "interview"
    offer = "offer"
    rejected = "rejected"
    no_response = "no_response"

class JobType(str, Enum):
    fulltime = "fulltime"
    contract = "contract"
    freelance = "freelance"

class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str = Field(max_length=200)
    role: str = Field(max_length=200)
    job_type: JobType = Field(default=JobType.fulltime)
    date_sent: str  # ISO "YYYY-MM-DD"
    status: ApplicationStatus = Field(default=ApplicationStatus.applied)
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ApplicationCreate(SQLModel):
    company: str
    role: str
    job_type: JobType = JobType.fulltime
    date_sent: str
    status: ApplicationStatus = ApplicationStatus.applied
    notes: Optional[str] = None

class ApplicationUpdate(SQLModel):
    company: Optional[str] = None
    role: Optional[str] = None
    job_type: Optional[JobType] = None
    date_sent: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    notes: Optional[str] = None

class ApplicationRead(SQLModel):
    id: int
    company: str
    role: str
    job_type: JobType
    date_sent: str
    status: ApplicationStatus
    notes: Optional[str]
    created_at: datetime

class RecruiterContact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: Optional[int] = Field(default=None, foreign_key="application.id")
    name: str = Field(max_length=200)
    company: str = Field(max_length=200)
    role: str = Field(max_length=200)
    last_contact_date: str  # ISO "YYYY-MM-DD"
    status: str = Field(default="active", max_length=100)
    note: Optional[str] = None

class RecruiterContactCreate(SQLModel):
    application_id: Optional[int] = None
    name: str
    company: str
    role: str
    last_contact_date: str
    status: str = "active"
    note: Optional[str] = None

class RecruiterContactUpdate(SQLModel):
    application_id: Optional[int] = None
    name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    last_contact_date: Optional[str] = None
    status: Optional[str] = None
    note: Optional[str] = None

class RecruiterContactRead(SQLModel):
    id: int
    application_id: Optional[int]
    name: str
    company: str
    role: str
    last_contact_date: str
    status: str
    note: Optional[str]

class StatusBanner(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    message: str
    is_active: bool = Field(default=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class StatusBannerUpdate(SQLModel):
    message: Optional[str] = None
    is_active: Optional[bool] = None

class WeeklyDataPoint(SQLModel):
    week: str
    count: int

class CumulativeDataPoint(SQLModel):
    date: str
    total: int

class DashboardStats(SQLModel):
    total_sent: int
    total_responses: int
    response_rate: float
    active_interviews: int
    offers_received: int
    status_breakdown: dict
    weekly_applications: List[WeeklyDataPoint]
    cumulative_applications: List[CumulativeDataPoint]
    by_job_type: dict
