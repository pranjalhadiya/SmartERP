from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, Company, Ledger, StockItem, Voucher

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.post("/select-company/{company_id}")
def select_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    company = db.query(Company).filter(
        Company.id == company_id,
        Company.user_id == user.id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    user.current_company_id = company.id
    db.commit()

    return {"message": "Company selected successfully"}

@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if not user.current_company_id:
        raise HTTPException(status_code=400, detail="No company selected")

    company = db.query(Company).filter(
        Company.id == user.current_company_id
    ).first()

    customers = db.query(Ledger).filter(
        Ledger.company_id == company.id,
        Ledger.ledger_type == "customer"
    ).count()

    suppliers = db.query(Ledger).filter(
        Ledger.company_id == company.id,
        Ledger.ledger_type == "supplier"
    ).count()

    items = db.query(StockItem).filter(
        StockItem.company_id == company.id
    ).count()

    sales = db.query(Voucher).filter(
        Voucher.company_id == company.id,
        Voucher.voucher_type == "sales"
    ).count()

    purchases = db.query(Voucher).filter(
        Voucher.company_id == company.id,
        Voucher.voucher_type == "purchase"
    ).count()

    return {
        "company": company.name,
        "customers": customers,
        "suppliers": suppliers,
        "items": items,
        "sales": sales,
        "purchases": purchases
    }