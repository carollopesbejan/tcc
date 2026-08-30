from fastapi import APIRouter

from schemas import FoodItem

router = APIRouter()

MOCK_ITEMS = [
    FoodItem(
        id="1",
        name="Maçã",
        category="Frutas",
        location="Fruteira",
        quantity=5,
        unit="un",
        expiryDate="2026-09-10",
        emoji="🍎",
    ),
    FoodItem(
        id="2",
        name="Leite",
        category="Laticínios",
        location="Geladeira",
        quantity=1,
        unit="l",
        expiryDate="2026-09-05",
        emoji="🥛",
    ),
]


@router.get("/items", response_model=list[FoodItem])
async def list_items() -> list[FoodItem]:
    return MOCK_ITEMS


@router.post("/items")
async def create_item(item: FoodItem):
    payload = item.model_dump() if hasattr(item, "model_dump") else item.dict()
    return {"status": "sucesso", "item": payload}
