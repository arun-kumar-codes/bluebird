from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user, require_organization_access
from ..core.database import get_db
from ..crud.note import note
from ..models.user import User, UserRole
from ..schemas.note import Note, NoteCreate, NoteUpdate

router = APIRouter()


@router.post("/", response_model=Note)
def create_note(
    note_in: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Create new note."""
    return note.create_with_owner(
        db=db,
        obj_in=note_in,
        created_by=current_user.id,
        organization_id=current_user.organization_id
    )


@router.get("/", response_model=List[Note])
def read_notes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Get notes for current user's organization."""
    return note.get_by_organization(
        db,
        organization_id=current_user.organization_id,
        skip=skip,
        limit=limit
    )


@router.get("/{note_id}", response_model=Note)
def read_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Get specific note."""
    db_note = note.get(db, id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Check organization access
    if db_note.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return db_note


@router.put("/{note_id}", response_model=Note)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Update note."""
    db_note = note.get(db, id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Check organization access
    if db_note.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Only creator or admin can update
    if (db_note.created_by != current_user.id and 
        current_user.role != UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return note.update(db=db, db_obj=db_note, obj_in=note_update)


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Delete note (admin only)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_note = note.get(db, id=note_id)
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Check organization access
    if db_note.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    note.remove(db=db, id=note_id)
    return {"message": "Note deleted successfully"}
