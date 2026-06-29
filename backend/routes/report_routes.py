from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from auth.dependencies import get_current_user
from models.models import User, StockItem, Voucher, Ledger

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/stock-summary")
def stock_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if user.current_company_id is None:
        raise HTTPException(status_code=400, detail="Please select company first")

    items = db.query(StockItem).filter(
        StockItem.company_id == user.current_company_id
    ).all()

    report = []

    for item in items:
        report.append({
            "id": item.id,
            "name": item.name,
            "sku": item.sku,
            "quantity": item.quantity,
            "purchase_price": item.purchase_price,
            "selling_price": item.selling_price,
            "stock_value": item.quantity * item.purchase_price
        })

    return report


@router.get("/sales")
def sales_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    sales = db.query(Voucher).filter(
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "sales"
    ).all()

    report = []

    for sale in sales:
        customer = db.query(Ledger).filter(Ledger.id == sale.party_id).first()
        item = db.query(StockItem).filter(StockItem.id == sale.item_id).first()

        report.append({
            "voucher_id": sale.id,
            "customer": customer.name if customer else "N/A",
            "item": item.name if item else "N/A",
            "quantity": sale.quantity,
            "amount": sale.total_amount
        })

    total_sales = sum(sale.total_amount for sale in sales)

    return {
        "total_sales": total_sales,
        "count": len(sales),
        "sales": report
    }


@router.get("/purchase")
def purchase_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    purchases = db.query(Voucher).filter(
        Voucher.company_id == user.current_company_id,
        Voucher.voucher_type == "purchase"
    ).all()

    report = []

    for purchase in purchases:
        supplier = db.query(Ledger).filter(Ledger.id == purchase.party_id).first()
        item = db.query(StockItem).filter(StockItem.id == purchase.item_id).first()

        report.append({
            "voucher_id": purchase.id,
            "supplier": supplier.name if supplier else "N/A",
            "item": item.name if item else "N/A",
            "quantity": purchase.quantity,
            "amount": purchase.total_amount
        })

    total_purchase = sum(purchase.total_amount for purchase in purchases)

    return {
        "total_purchase": total_purchase,
        "count": len(purchases),
        "purchases": report
    }


@router.get("/outstanding")
def outstanding_report(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    ledgers = db.query(Ledger).filter(
        Ledger.company_id == user.current_company_id
    ).all()

    report = []

    for ledger in ledgers:
        report.append({
            "id": ledger.id,
            "name": ledger.name,
            "ledger_type": ledger.ledger_type,
            "balance": ledger.opening_balance
        })

    return report