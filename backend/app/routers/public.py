from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List

from app.db import get_session
from app.models import Release, ReleasePublic, VisibilityEnum

router = APIRouter(prefix="/public", tags=["public"])

@router.get("/releases", response_model=List[ReleasePublic])
def list_public_releases(
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    session: Session = Depends(get_session)
):
    statement = (
        select(Release)
        .where(Release.visibility == VisibilityEnum.published)
        .order_by(Release.published_at.desc())
        .offset(offset)
        .limit(limit)
    )
    releases = session.exec(statement).all()
    return releases

@router.get("/releases/{slug}", response_model=ReleasePublic)
def get_public_release(slug: str, session: Session = Depends(get_session)):
    statement = select(Release).where(
        Release.slug == slug,
        Release.visibility == VisibilityEnum.published
    )
    release = session.exec(statement).first()

    if not release:
        raise HTTPException(status_code=404, detail="Release not found")

    return release
