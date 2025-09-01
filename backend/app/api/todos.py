from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.auth import get_current_active_user, require_organization_access
from ..core.database import get_db
from ..crud.todo import todo
from ..models.user import User, UserRole
from ..schemas.todo import Todo, TodoCreate, TodoUpdate

router = APIRouter()


@router.post("/", response_model=Todo)
def create_todo(
    todo_in: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Create new todo."""
    return todo.create_with_owner(
        db=db,
        obj_in=todo_in,
        created_by=current_user.id,
        organization_id=current_user.organization_id
    )


@router.get("/", response_model=List[Todo])
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Get todos for current user's organization."""
    return todo.get_by_organization(
        db,
        organization_id=current_user.organization_id,
        skip=skip,
        limit=limit
    )


@router.get("/{todo_id}", response_model=Todo)
def read_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Get specific todo."""
    db_todo = todo.get(db, id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Check organization access
    if db_todo.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return db_todo


@router.put("/{todo_id}", response_model=Todo)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Update todo."""
    db_todo = todo.get(db, id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Check organization access
    if db_todo.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Only creator or admin can update
    if (db_todo.created_by != current_user.id and 
        current_user.role != UserRole.ADMIN):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return todo.update(db=db, db_obj=db_todo, obj_in=todo_update)


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_organization_access)
):
    """Delete todo (admin only)."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_todo = todo.get(db, id=todo_id)
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Check organization access
    if db_todo.organization_id != current_user.organization_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    todo.remove(db=db, id=todo_id)
    return {"message": "Todo deleted successfully"}
