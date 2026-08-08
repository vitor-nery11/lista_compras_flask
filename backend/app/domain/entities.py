from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class ShoppingList:
    id: Optional[int]
    name: str
    budget: Optional[float]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'budget': self.budget,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

@dataclass
class ShoppingItem:
    id: Optional[int]
    list_id: int
    name: str
    category: Optional[str]
    quantity: float
    unit: str
    unit_price: float
    purchased: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def to_dict(self):
        return {
            'id': self.id,
            'list_id': self.list_id,
            'name': self.name,
            'category': self.category,
            'quantity': self.quantity,
            'unit': self.unit,
            'unit_price': self.unit_price,
            'purchased': self.purchased,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
