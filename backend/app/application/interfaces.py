from abc import ABC, abstractmethod
from typing import List, Optional, Tuple
from ..domain.entities import ShoppingList, ShoppingItem

class ListRepository(ABC):
    @abstractmethod
    def create(self, shopping_list: ShoppingList) -> ShoppingList:
        pass
        
    @abstractmethod
    def get_all(self) -> List[ShoppingList]:
        pass
        
    @abstractmethod
    def get_by_id(self, list_id: int) -> Optional[ShoppingList]:
        pass
        
    @abstractmethod
    def update(self, shopping_list: ShoppingList) -> ShoppingList:
        pass
        
    @abstractmethod
    def delete(self, list_id: int) -> bool:
        pass

class ItemRepository(ABC):
    @abstractmethod
    def create(self, item: ShoppingItem) -> ShoppingItem:
        pass
        
    @abstractmethod
    def get_by_list_id(self, list_id: int) -> List[ShoppingItem]:
        pass
        
    @abstractmethod
    def get_by_id(self, item_id: int) -> Optional[ShoppingItem]:
        pass
        
    @abstractmethod
    def update(self, item: ShoppingItem) -> ShoppingItem:
        pass
        
    @abstractmethod
    def delete(self, item_id: int) -> bool:
        pass
        
    @abstractmethod
    def get_history_by_name(self, name: str) -> List[Tuple[ShoppingItem, ShoppingList]]:
        pass
