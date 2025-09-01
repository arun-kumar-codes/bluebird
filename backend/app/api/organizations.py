from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user, require_admin
from ..core.database import get_db
from ..crud.organization import organization
from ..models.user import User
from ..schemas.organization import Organization, OrganizationCreate

router = APIRouter()


@router.post("/", response_model=Organization)
def create_organization(
    org_in: OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Create new organization (admin only)."""
    # Check if organization name already exists
    db_org = organization.get_by_name(db, name=org_in.name)
    if db_org:
        raise HTTPException(
            status_code=400,
            detail="Organization name already exists"
        )
    
    return organization.create(db=db, obj_in=org_in)


@router.get("/", response_model=List[Organization])
def read_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all organizations (admin only)."""
    return organization.get_multi(db, skip=skip, limit=limit)


@router.get("/{organization_id}", response_model=Organization)
def read_organization(
    organization_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get organization by ID."""
    db_org = organization.get(db, id=organization_id)
    if db_org is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Users can only see their own organization unless they're admin
    if (current_user.organization_id != organization_id and 
        current_user.role.value != "admin"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_org
