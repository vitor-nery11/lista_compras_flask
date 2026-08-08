from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func

from ...domain.entities import ShoppingList, ShoppingItem
from ...application.interfaces import ListRepository, ItemRepository
from .models import SQLShoppingList, SQLShoppingItem, db

class SQLAlchemyListRepository(ListRepository):
    
    def _to_domain(self, sql_model: SQLShoppingList) -> ShoppingList:
        return ShoppingList(
            id=sql_model.id,
            name=sql_model.name,
            budget=sql_model.budget,
            created_at=sql_model.created_at,
            updated_at=sql_model.updated_at
        )
        
    def _to_sql(self, domain_model: ShoppingList) -> SQLShoppingList:
        # Note: We update an existing or create a new one based on id
        sql_model = SQLShoppingList(
            id=domain_model.id,
            name=domain_model.name,
            budget=domain_model.budget,
        )
        return sql_model

    def create(self, shopping_list: ShoppingList) -> ShoppingList:
        sql_model = self._to_sql(shopping_list)
        db.session.add(sql_model)
        db.session.commit()
        return self._to_domain(sql_model)

    def get_all(self) -> List[ShoppingList]:
        sql_lists = SQLShoppingList.query.order_by(SQLShoppingList.created_at.desc()).all()
        return [self._to_domain(s) for s in sql_lists]

    def get_by_id(self, list_id: int) -> Optional[ShoppingList]:
        sql_list = SQLShoppingList.query.get(list_id)
        if sql_list:
            return self._to_domain(sql_list)
        return None

    def update(self, shopping_list: ShoppingList) -> ShoppingList:
        sql_model = SQLShoppingList.query.get(shopping_list.id)
        if sql_model:
            sql_model.name = shopping_list.name
            sql_model.budget = shopping_list.budget
            db.session.commit()
            return self._to_domain(sql_model)
        raise ValueError("List not found in database")

    def delete(self, list_id: int) -> bool:
        sql_model = SQLShoppingList.query.get(list_id)
        if sql_model:
            db.session.delete(sql_model)
            db.session.commit()
            return True
        return False


class SQLAlchemyItemRepository(ItemRepository):

    def _to_domain(self, sql_model: SQLShoppingItem) -> ShoppingItem:
        return ShoppingItem(
            id=sql_model.id,
            list_id=sql_model.list_id,
            name=sql_model.name,
            category=sql_model.category,
            quantity=sql_model.quantity,
            unit=sql_model.unit,
            unit_price=sql_model.unit_price,
            purchased=sql_model.purchased,
            created_at=sql_model.created_at,
            updated_at=sql_model.updated_at
        )

    def _to_sql(self, domain_model: ShoppingItem) -> SQLShoppingItem:
        sql_model = SQLShoppingItem(
            id=domain_model.id,
            list_id=domain_model.list_id,
            name=domain_model.name,
            category=domain_model.category,
            quantity=domain_model.quantity,
            unit=domain_model.unit,
            unit_price=domain_model.unit_price,
            purchased=domain_model.purchased
        )
        return sql_model

    def create(self, item: ShoppingItem) -> ShoppingItem:
        sql_model = self._to_sql(item)
        db.session.add(sql_model)
        db.session.commit()
        return self._to_domain(sql_model)

    def get_by_list_id(self, list_id: int) -> List[ShoppingItem]:
        sql_items = SQLShoppingItem.query.filter_by(list_id=list_id).order_by(SQLShoppingItem.created_at.desc()).all()
        return [self._to_domain(i) for i in sql_items]

    def get_by_id(self, item_id: int) -> Optional[ShoppingItem]:
        sql_item = SQLShoppingItem.query.get(item_id)
        if sql_item:
            return self._to_domain(sql_item)
        return None

    def update(self, item: ShoppingItem) -> ShoppingItem:
        sql_model = SQLShoppingItem.query.get(item.id)
        if sql_model:
            sql_model.name = item.name
            sql_model.category = item.category
            sql_model.quantity = item.quantity
            sql_model.unit = item.unit
            sql_model.unit_price = item.unit_price
            sql_model.purchased = item.purchased
            db.session.commit()
            return self._to_domain(sql_model)
        raise ValueError("Item not found in database")

    def delete(self, item_id: int) -> bool:
        sql_model = SQLShoppingItem.query.get(item_id)
        if sql_model:
            db.session.delete(sql_model)
            db.session.commit()
            return True
        return False

    def get_history_by_name(self, name: str) -> List[Tuple[ShoppingItem, ShoppingList]]:
        # SQLite's LOWER() does not handle Unicode/accents correctly.
        # We fetch all joined records and filter in Python to ensure accurate matching.
        history = db.session.query(SQLShoppingItem, SQLShoppingList).join(
            SQLShoppingList, SQLShoppingItem.list_id == SQLShoppingList.id
        ).order_by(SQLShoppingList.created_at.asc()).all()
        
        list_repo = SQLAlchemyListRepository()
        
        target_name = name.strip().lower()
        result = []
        for item, s_list in history:
            if item.name and item.name.strip().lower() == target_name:
                result.append((self._to_domain(item), list_repo._to_domain(s_list)))
        return result
