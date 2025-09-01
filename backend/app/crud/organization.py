from typing import Optional
from sqlalchemy.orm import Session
from .base import CRUDBase
from ..models.organization import Organization
from ..schemas.organization import OrganizationCreate


class CRUDOrganization(CRUDBase[Organization, OrganizationCreate, dict]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Organization]:
        return db.query(Organization).filter(Organization.name == name).first()


organization = CRUDOrganization(Organization)
