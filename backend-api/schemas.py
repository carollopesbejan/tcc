from __future__ import annotations

from pydantic import BaseModel


class FoodItem(BaseModel):
    id: str | None = None
    name: str
    category: str
    location: str
    quantity: float
    unit: str
    expiryDate: str
    emoji: str
