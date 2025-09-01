#!/usr/bin/env python3
"""
Script to create test data for the application.
"""
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.crud.user import user
from app.crud.organization import organization
from app.schemas.user import UserCreate
from app.schemas.organization import OrganizationCreate
from app.models.user import UserRole

def create_test_data():
    """Create test data."""
    db = SessionLocal()
    
    try:
        # Create organization
        print("Creating test organization...")
        org_data = OrganizationCreate(
            name="Acme Corp",
            description="A test organization for demo purposes"
        )
        test_org = organization.create(db=db, obj_in=org_data)
        print(f"✅ Created organization: {test_org.name} (ID: {test_org.id})")
        
        # Create admin user
        print("Creating admin user...")
        admin_data = UserCreate(
            username="admin",
            email="admin@acmecorp.com",
            password="admin123",
            organization_id=test_org.id,
            role=UserRole.ADMIN
        )
        admin_user = user.create(db=db, obj_in=admin_data)
        print(f"✅ Created admin user: {admin_user.username} (ID: {admin_user.id})")
        
        # Create member user
        print("Creating member user...")
        member_data = UserCreate(
            username="john_doe",
            email="john@acmecorp.com",
            password="member123",
            organization_id=test_org.id,
            role=UserRole.MEMBER
        )
        member_user = user.create(db=db, obj_in=member_data)
        print(f"✅ Created member user: {member_user.username} (ID: {member_user.id})")
        
        print("\n🎉 Test data created successfully!")
        print("\nLogin credentials:")
        print("Admin: admin / admin123")
        print("Member: john_doe / member123")
        
    except Exception as e:
        print(f"❌ Error creating test data: {e}")
        return False
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    success = create_test_data()
    sys.exit(0 if success else 1)
