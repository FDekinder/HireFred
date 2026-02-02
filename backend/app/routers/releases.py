from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from datetime import datetime
from typing import List, Optional
import re

from app.db import get_session
from app.models import (
    Release, ReleaseCreate, ReleaseRead, ReleaseUpdate,
    User, VisibilityEnum
)
from app.core.security import get_current_user

router = APIRouter(prefix="/releases", tags=["releases"])

def generate_slug(title: str, version: str) -> str:
    """Generate a URL-friendly slug from title and version."""
    combined = f"{title}-{version}".lower()
    slug = re.sub(r'[^a-z0-9\-]', '-', combined)
    slug = re.sub(r'-+', '-', slug).strip('-')
    return slug

@router.get("", response_model=List[ReleaseRead])
def list_releases(
    status: Optional[VisibilityEnum] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Release).where(Release.user_id == current_user.id)

    if status:
        statement = statement.where(Release.visibility == status)

    statement = statement.order_by(Release.created_at.desc()).offset(offset).limit(limit)
    releases = session.exec(statement).all()
    return releases

@router.post("", response_model=ReleaseRead, status_code=status.HTTP_201_CREATED)
def create_release(
    release_data: ReleaseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    release = Release(
        **release_data.model_dump(),
        user_id=current_user.id,
        slug=generate_slug(release_data.title, release_data.version)
    )
    session.add(release)
    session.commit()
    session.refresh(release)
    return release

@router.get("/{release_id}", response_model=ReleaseRead)
def get_release(
    release_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    release = session.get(Release, release_id)

    if not release:
        raise HTTPException(status_code=404, detail="Release not found")

    if release.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this release")

    return release

@router.put("/{release_id}", response_model=ReleaseRead)
def update_release(
    release_id: int,
    release_data: ReleaseUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    release = session.get(Release, release_id)

    if not release:
        raise HTTPException(status_code=404, detail="Release not found")

    if release.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this release")

    update_dict = release_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(release, key, value)

    release.updated_at = datetime.utcnow()

    # Regenerate slug if title or version changed
    if "title" in update_dict or "version" in update_dict:
        release.slug = generate_slug(release.title, release.version)

    session.add(release)
    session.commit()
    session.refresh(release)
    return release

@router.delete("/{release_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_release(
    release_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    release = session.get(Release, release_id)

    if not release:
        raise HTTPException(status_code=404, detail="Release not found")

    if release.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this release")

    session.delete(release)
    session.commit()

@router.post("/{release_id}/publish", response_model=ReleaseRead)
def publish_release(
    release_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    release = session.get(Release, release_id)

    if not release:
        raise HTTPException(status_code=404, detail="Release not found")

    if release.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to publish this release")

    release.visibility = VisibilityEnum.published
    release.published_at = datetime.utcnow()
    release.updated_at = datetime.utcnow()

    if not release.slug:
        release.slug = generate_slug(release.title, release.version)

    session.add(release)
    session.commit()
    session.refresh(release)
    return release

@router.post("/{release_id}/unpublish", response_model=ReleaseRead)
def unpublish_release(
    release_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    release = session.get(Release, release_id)

    if not release:
        raise HTTPException(status_code=404, detail="Release not found")

    if release.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to unpublish this release")

    release.visibility = VisibilityEnum.draft
    release.updated_at = datetime.utcnow()

    session.add(release)
    session.commit()
    session.refresh(release)
    return release
