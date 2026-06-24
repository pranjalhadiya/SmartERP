from fastapi import APIRouter

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.get("/")
def company_test():
    return {"message": "Company route working"}