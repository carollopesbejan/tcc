from pydantic import BaseModel, ConfigDict

class FoodItem(BaseModel):
    id: int | None = None  # <-- Mudou de str para int
    name: str
    category: str
    location: str
    quantity: float
    unit: str
    expiryDate: str
    emoji: str

    model_config = ConfigDict(from_attributes=True) # <-- Permite ler os dados do Banco