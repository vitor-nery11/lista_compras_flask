from typing import List, Optional
from ..domain.entities import ShoppingList, ShoppingItem
from .interfaces import ListRepository, ItemRepository

class ListUseCases:
    def __init__(self, repository: ListRepository):
        self.repository = repository
        
    def create_list(self, name: str, budget: Optional[float]) -> ShoppingList:
        if not name:
            raise ValueError("Name is required")
        if budget is not None and budget < 0:
            raise ValueError("Budget cannot be negative")
            
        new_list = ShoppingList(id=None, name=name, budget=budget)
        return self.repository.create(new_list)
        
    def get_all_lists(self) -> List[ShoppingList]:
        return self.repository.get_all()
        
    def get_list(self, list_id: int) -> Optional[ShoppingList]:
        return self.repository.get_by_id(list_id)
        
    def update_list(self, list_id: int, name: Optional[str] = None, budget: Optional[float] = None) -> ShoppingList:
        shopping_list = self.repository.get_by_id(list_id)
        if not shopping_list:
            raise ValueError("List not found")
            
        if name is not None:
            if not name:
                raise ValueError("Name cannot be empty")
            shopping_list.name = name
            
        if budget is not None:
            if budget < 0:
                raise ValueError("Budget cannot be negative")
            shopping_list.budget = budget
            
        return self.repository.update(shopping_list)
        
    def delete_list(self, list_id: int) -> bool:
        if not self.repository.get_by_id(list_id):
            raise ValueError("List not found")
        return self.repository.delete(list_id)


class ItemUseCases:
    def __init__(self, repository: ItemRepository, list_repository: ListRepository):
        self.repository = repository
        self.list_repository = list_repository
        
    def add_item(self, list_id: int, name: str, category: Optional[str], quantity: float, unit: str, unit_price: float) -> ShoppingItem:
        if not self.list_repository.get_by_id(list_id):
            raise ValueError("List not found")
            
        if not name:
            raise ValueError("Name is required")
        if quantity <= 0:
            raise ValueError("Quantity must be greater than zero")
        if unit_price < 0:
            raise ValueError("Unit price cannot be negative")
            
        item = ShoppingItem(
            id=None,
            list_id=list_id,
            name=name,
            category=category,
            quantity=quantity,
            unit=unit,
            unit_price=unit_price,
            purchased=False
        )
        return self.repository.create(item)
        
    def get_items_by_list(self, list_id: int) -> List[ShoppingItem]:
        if not self.list_repository.get_by_id(list_id):
            raise ValueError("List not found")
        return self.repository.get_by_list_id(list_id)
        
    def update_item(self, item_id: int, data: dict) -> ShoppingItem:
        item = self.repository.get_by_id(item_id)
        if not item:
            raise ValueError("Item not found")
            
        if 'name' in data:
            if not data['name']:
                raise ValueError("Name cannot be empty")
            item.name = data['name']
            
        if 'category' in data:
            item.category = data['category']
            
        if 'quantity' in data:
            if data['quantity'] <= 0:
                raise ValueError("Quantity must be greater than zero")
            item.quantity = data['quantity']
            
        if 'unit' in data:
            item.unit = data['unit']
            
        if 'unit_price' in data:
            if data['unit_price'] < 0:
                raise ValueError("Unit price cannot be negative")
            item.unit_price = data['unit_price']
            
        return self.repository.update(item)
        
    def delete_item(self, item_id: int) -> bool:
        if not self.repository.get_by_id(item_id):
            raise ValueError("Item not found")
        return self.repository.delete(item_id)
        
    def toggle_purchased(self, item_id: int, purchased: Optional[bool] = None) -> ShoppingItem:
        item = self.repository.get_by_id(item_id)
        if not item:
            raise ValueError("Item not found")
            
        if purchased is not None:
            item.purchased = bool(purchased)
        else:
            item.purchased = not item.purchased
            
        return self.repository.update(item)
        
    def get_price_history(self, name: str) -> List[dict]:
        if not name:
            raise ValueError("Item name is required")
            
        history = self.repository.get_history_by_name(name)
        
        result = []
        for item, s_list in history:
            result.append({
                'date': s_list.created_at.isoformat(),
                'list_name': s_list.name,
                'price': item.unit_price,
                'quantity': item.quantity,
                'unit': item.unit
            })
        return result
