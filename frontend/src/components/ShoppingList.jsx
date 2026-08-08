import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import AddItemForm from './AddItemForm';
import ShoppingItem from './ShoppingItem';
import Summary from './Summary';
import PriceHistoryModal from './PriceHistoryModal';
import { Loader, ShoppingBag } from 'lucide-react';

const ShoppingList = ({ listId, listData }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyItemName, setHistoryItemName] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lists/${listId}/items`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async (itemData) => {
    // Optimistic Update
    const tempId = Date.now();
    const optimisticItem = { ...itemData, id: tempId, purchased: false, unit_price: parseFloat(itemData.unit_price) || 0, quantity: parseFloat(itemData.quantity) || 1 };
    setItems(prev => [optimisticItem, ...prev]);

    try {
      const response = await api.post(`/lists/${listId}/items`, itemData);
      // Replace optimistic item with real item from server
      setItems(prev => prev.map(i => i.id === tempId ? response.data : i));
    } catch (error) {
      console.error("Error adding item", error);
      // Revert on error
      setItems(prev => prev.filter(i => i.id !== tempId));
    }
  };

  const handleTogglePurchased = async (item) => {
    // Optimistic Update
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, purchased: !item.purchased } : i));
    
    try {
      const response = await api.patch(`/items/${item.id}/purchased`, {
        purchased: !item.purchased
      });
      // Ensure sync with server response (optional but good)
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, purchased: response.data.purchased } : i));
    } catch (error) {
      console.error("Error updating item status", error);
      // Revert on error
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, purchased: item.purchased } : i));
    }
  };

  const handleDeleteItem = async (itemId) => {
    // Optimistic Update
    const itemToDelete = items.find(i => i.id === itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));

    try {
      await api.delete(`/items/${itemId}`);
    } catch (error) {
      console.error("Error deleting item", error);
      // Revert on error
      if (itemToDelete) {
        setItems(prev => [...prev, itemToDelete]);
      }
    }
  };

  const handleEditItem = async (itemId, updatedData) => {
    // Optimistic Update
    const originalItem = items.find(i => i.id === itemId);
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updatedData } : i));

    try {
      const response = await api.put(`/items/${itemId}`, updatedData);
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...response.data } : i));
    } catch (error) {
      console.error("Error editing item", error);
      // Revert on error
      if (originalItem) {
        setItems(prev => prev.map(i => i.id === itemId ? originalItem : i));
      }
    }
  };

  // Calculations
  const total = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
  const purchasedCount = items.filter(item => item.purchased).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Summary 
        total={total} 
        budget={listData.budget} 
        purchasedCount={purchasedCount}
        totalItems={items.length}
      />
      
      <AddItemForm onAdd={handleAddItem} />

      <div className="mt-8">
        <h2 className="flex items-center mb-6 text-xl font-bold text-slate-800">
          <ShoppingBag className="w-6 h-6 mr-2 text-blue-600" />
          Produtos na Lista
        </h2>
        
        {items.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed rounded-xl border-slate-200">
            <p className="text-slate-500">Nenhum produto adicionado ainda.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <ShoppingItem 
                key={item.id} 
                item={item} 
                onTogglePurchased={handleTogglePurchased}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
                onViewHistory={setHistoryItemName}
              />
            ))}
          </div>
        )}
      </div>

      {historyItemName && (
        <PriceHistoryModal 
          itemName={historyItemName} 
          onClose={() => setHistoryItemName(null)} 
        />
      )}
    </div>
  );
};

export default ShoppingList;
