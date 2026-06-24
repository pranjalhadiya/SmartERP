from fastapi import APIRouter

router = APIRouter(prefix="/ledgers", tags=["Ledgers"])

@router.get("/")
def ledger_test():
    return {"message": "Ledger route working"}