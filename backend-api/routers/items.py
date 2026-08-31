from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
import models
from schemas import FoodItem


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = APIRouter()


@router.get("/items", response_model=list[FoodItem])
async def list_items(db: Session = Depends(get_db)) -> list[FoodItem]:
    items = db.query(models.FoodItemDB).all()
    return items


@router.post("/items", response_model=FoodItem)
async def create_item(item: FoodItem, db: Session = Depends(get_db)):
    db_item = models.FoodItemDB(
        name=item.name,
        category=item.category,
        location=item.location,
        quantity=item.quantity,
        unit=item.unit,
        expiryDate=item.expiryDate,
        emoji=item.emoji,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
