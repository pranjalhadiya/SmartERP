from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.models import Company
from schemas.schemas import CompanyCreate
from auth.dependencies import get_current_user

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)

@router.post("/")
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    new_company = Company(
        name=company.name,
        address=company.address,
        gst_number=company.gst_number,
        state=company.state,
        user_id=current_user["user_id"]
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return {
        "message": "Company created",
        "company": new_company
    }

@router.get("/")
def get_companies(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    companies = db.query(Company).filter(
        Company.user_id == current_user["user_id"]
    ).all()

    return companies

@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    company = db.query(Company).filter(
        Company.id == company_id,
        Company.user_id == current_user["user_id"]
    ).first()

    if not company:
        raise HTTPException(
            status_code=404,
            detail="Company not found"
        )

    db.delete(company)
    db.commit()

    return {"message": "Company deleted"}

