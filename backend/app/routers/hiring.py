from fastapi import APIRouter, Depends, HTTPException, Header
from sqlmodel import Session, select
from typing import List, Optional
from collections import defaultdict, Counter
from datetime import date, timedelta

from app.db import get_session
from app.models import (
    Application, ApplicationCreate, ApplicationUpdate, ApplicationRead,
    RecruiterContact, RecruiterContactCreate, RecruiterContactUpdate, RecruiterContactRead,
    StatusBanner, StatusBannerUpdate,
    WeeklyDataPoint, CumulativeDataPoint, DashboardStats,
)
from app.core.config import settings

router = APIRouter(prefix="/api/hiring", tags=["hiring"])


def verify_admin_key(x_admin_key: Optional[str] = Header(default=None)):
    """Dependency that checks the X-Admin-Key header against the env var HIRING_ADMIN_KEY."""
    admin_key = getattr(settings, "HIRING_ADMIN_KEY", None)
    if not admin_key:
        raise HTTPException(status_code=500, detail="Admin key not configured")
    if x_admin_key != admin_key:
        raise HTTPException(status_code=401, detail="Invalid admin key")


# ── Public endpoints ───────────────────────────────────────────────────────────

@router.get("/banner")
def get_banner(session: Session = Depends(get_session)):
    banner = session.exec(select(StatusBanner).where(StatusBanner.is_active == True)).first()
    return banner  # returns None if no active banner


@router.get("/contacts", response_model=List[RecruiterContactRead])
def list_contacts(session: Session = Depends(get_session)):
    contacts = session.exec(select(RecruiterContact)).all()
    return contacts


@router.get("/dashboard")
def get_dashboard(session: Session = Depends(get_session)):
    apps = session.exec(select(Application)).all()

    total_sent = len(apps)
    response_statuses = {"response", "interview", "offer", "rejected"}
    total_responses = sum(1 for a in apps if a.status in response_statuses)
    response_rate = round(total_responses / total_sent * 100, 1) if total_sent > 0 else 0.0
    active_interviews = sum(1 for a in apps if a.status == "interview")
    offers_received = sum(1 for a in apps if a.status == "offer")

    status_breakdown = dict(Counter(a.status for a in apps))

    # Weekly applications — last 8 ISO weeks
    weekly: defaultdict[str, int] = defaultdict(int)
    for a in apps:
        try:
            d = date.fromisoformat(a.date_sent)
            week_label = d.strftime("%Y-W%V")
            weekly[week_label] += 1
        except ValueError:
            pass

    today = date.today()
    last_8_weeks = [
        (today - timedelta(weeks=i)).strftime("%Y-W%V")
        for i in range(7, -1, -1)
    ]
    weekly_applications = [
        WeeklyDataPoint(week=w, count=weekly.get(w, 0))
        for w in last_8_weeks
    ]

    # Cumulative applications sorted by date
    sorted_dates = sorted(
        (a.date_sent for a in apps if a.date_sent),
        key=lambda d: d
    )
    cumulative_applications = [
        CumulativeDataPoint(date=d, total=i + 1)
        for i, d in enumerate(sorted_dates)
    ]

    by_job_type = dict(Counter(a.job_type for a in apps))

    return DashboardStats(
        total_sent=total_sent,
        total_responses=total_responses,
        response_rate=response_rate,
        active_interviews=active_interviews,
        offers_received=offers_received,
        status_breakdown=status_breakdown,
        weekly_applications=weekly_applications,
        cumulative_applications=cumulative_applications,
        by_job_type=by_job_type,
    )


# ── Protected endpoints ────────────────────────────────────────────────────────

@router.get("/applications", response_model=List[ApplicationRead])
def list_applications(
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    return session.exec(select(Application).order_by(Application.date_sent.desc())).all()


@router.post("/applications", response_model=ApplicationRead, status_code=201)
def create_application(
    data: ApplicationCreate,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    app = Application(**data.model_dump())
    session.add(app)
    session.commit()
    session.refresh(app)
    return app


@router.put("/applications/{app_id}", response_model=ApplicationRead)
def update_application(
    app_id: int,
    data: ApplicationUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    app = session.get(Application, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(app, field, value)
    session.add(app)
    session.commit()
    session.refresh(app)
    return app


@router.delete("/applications/{app_id}", status_code=204)
def delete_application(
    app_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    app = session.get(Application, app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    session.delete(app)
    session.commit()


@router.post("/contacts", response_model=RecruiterContactRead, status_code=201)
def create_contact(
    data: RecruiterContactCreate,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    contact = RecruiterContact(**data.model_dump())
    session.add(contact)
    session.commit()
    session.refresh(contact)
    return contact


@router.put("/contacts/{contact_id}", response_model=RecruiterContactRead)
def update_contact(
    contact_id: int,
    data: RecruiterContactUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    contact = session.get(RecruiterContact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    session.add(contact)
    session.commit()
    session.refresh(contact)
    return contact


@router.delete("/contacts/{contact_id}", status_code=204)
def delete_contact(
    contact_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    contact = session.get(RecruiterContact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    session.delete(contact)
    session.commit()


@router.put("/banner")
def upsert_banner(
    data: StatusBannerUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(verify_admin_key),
):
    banner = session.exec(select(StatusBanner)).first()
    if banner is None:
        banner = StatusBanner(message=data.message or "", is_active=True)
    else:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(banner, field, value)
        from datetime import datetime
        banner.updated_at = datetime.utcnow()
    session.add(banner)
    session.commit()
    session.refresh(banner)
    return banner
