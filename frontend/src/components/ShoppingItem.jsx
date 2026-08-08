import React, { useState } from 'react';
import { Trash2, CheckCircle2, Circle, Pencil, X, Check, TrendingUp } from 'lucide-react';

const ShoppingItem = ({ item, onTogglePurchased, onDelete, onEdit, onViewHistory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editCategory, setEditCategory] = useState(item.category || '');
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [editUnit, setEditUnit] = useState(item.unit || 'un');
  const [editUnitPrice, setEditUnitPrice] = useState(item.unit_price);

  const subtotal = item.quantity * item.unit_price;

  const handleSave = () => {
    if (!editName.trim()) return;
    
    onEdit(item.id, {
      name: editName,
      category: editCategory,
      quantity: parseFloat(editQuantity) || 1,
      unit: editUnit,
      unit_price: parseFloat(editUnitPrice) || 0
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditCategory(item.category || '');
    setEditQuantity(item.quantity);
    setEditUnit(item.unit || 'un');
    setEditUnitPrice(item.unit_price);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 mb-3 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Nome</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Categoria</label>
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Qtd/Un</label>
            <div className="flex">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
                className="w-2/3 px-2 py-1.5 text-sm border border-gray-300 rounded-l focus:outline-none focus:border-blue-500"
              />
              <select
                value={editUnit}
                onChange={(e) => setEditUnit(e.target.value)}
                className="w-1/3 px-1 py-1.5 text-sm border-t border-b border-r border-gray-300 rounded-r bg-gray-50 focus:outline-none focus:border-blue-500"
              >
                <option value="un">un</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="L">L</option>
                <option value="ml">ml</option>
                <option value="pct">pct</option>
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Preço Un.</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editUnitPrice}
              onChange={(e) => setEditUnitPrice(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-end justify-end gap-2 md:col-span-1">
            <button 
              onClick={handleSave}
              className="p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-colors"
              title="Salvar"
            >
              <Check className="w-4 h-4" />
            </button>
            <button 
              onClick={handleCancel}
              className="p-2 text-white bg-slate-400 rounded hover:bg-slate-500 transition-colors"
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 mb-3 transition-all border rounded-xl shadow-sm hover:shadow-md ${
      item.purchased ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'
    }`}>
      <div className="flex items-start flex-1 gap-4">
        <button 
          onClick={() => onTogglePurchased(item)}
          className="mt-1 focus:outline-none flex-shrink-0"
        >
          {item.purchased ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 hover:text-blue-500 transition-colors" />
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${item.purchased ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {item.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{item.category || 'Geral'}</span>
            <span>
              {item.quantity} {item.unit || 'un'} × R$ {item.unit_price.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-right">
        <div>
          <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Subtotal</p>
          <p className={`text-lg font-bold ${item.purchased ? 'text-slate-400' : 'text-blue-600'}`}>
            R$ {subtotal.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div className="flex flex-col gap-1 ml-2">
          <button 
            onClick={() => onViewHistory(item.name)}
            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none"
            title="Ver histórico de preços"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none"
            title="Editar produto"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
            title="Remover produto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingItem;
