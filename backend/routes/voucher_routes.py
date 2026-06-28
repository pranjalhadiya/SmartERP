from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, Voucher, StockItem, Ledger
from schemas.schemas import PurchaseVoucherCreate

router = APIRouter(
    prefix="/vouchers",
    tags=["Vouchers"]
)


@router.post("/purchase")
def create_purchase_voucher(
    voucher: PurchaseVoucherCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user.current_company_id is None:
        raise HTTPException(status_code=400, detail="Please select company first")

    supplier = db.query(Ledger).filter(
        Ledger.id == voucher.party_id,
        Ledger.company_id == user.current_company_id,
        Ledger.ledger_type == "supplier"
    ).first()

    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    item = db.query(StockItem).filter(
        StockItem.id == voucher.item_id,
        StockItem.company_id == user.current_company_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    amount = voucher.quantity * voucher.rate
    gst_amount = amount * voucher.gst_percent / 100
    total = amount + gst_amount

    item.quantity = item.quantity + voucher.quantity
    supplier.opening_balance = supplier.opening_balance + total

    new_voucher = Voucher(
        voucher_type="purchase",
        party_id=voucher.party_id,
        item_id=voucher.item_id,
        quantity=voucher.quantity,
        rate=voucher.rate,
        gst_percent=voucher.gst_percent,
        total_amount=total,
        company_id=user.current_company_id
    )

    db.add(new_voucher)
    db.commit()
    db.refresh(new_voucher)

    return {
        "message": "Purchase voucher created successfully",
        "voucher": new_voucher,
        "stock_updated": item.quantity,
        "supplier_balance": supplier.opening_balance
    }


@router.get("/purchase")
def get_purchase_vouchers(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    purchases = db.query(Voucher).filter(
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "purchase"
    ).all()

    return purchases
