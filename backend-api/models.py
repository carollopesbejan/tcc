from sqlalchemy import Column, Integer, String, Float
from database import Base


class FoodItemDB(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    expiryDate = Column(String, nullable=False)
    emoji = Column(String, nullable=False)
