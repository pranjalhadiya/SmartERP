from fastapi import APIRouter

router = APIRouter(prefix="/vouchers", tags=["Vouchers"])

@router.get("/")
def voucher_test():
    return {"message": "Voucher route working"}