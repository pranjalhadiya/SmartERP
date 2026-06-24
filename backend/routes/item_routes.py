from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("/")
def item_test():
    return {"message": "Item route working"}