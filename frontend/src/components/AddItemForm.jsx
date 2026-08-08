import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AddItemForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('un');
  const [unitPrice, setUnitPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      category,
      quantity: parseFloat(quantity) || 1,
      unit,
      unit_price: parseFloat(unitPrice) || 0
    });

    setName('');
    setCategory('');
    setQuantity(1);
    setUnitPrice('');
  };

  return (
    <div className="p-6 mb-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
      <h3 className="mb-4 text-lg font-bold text-slate-800">Adicionar Produto</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Arroz"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="md:col-span-3">
          <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Categoria</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Alimentos"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Qtd / Unidade</label>
          <div className="flex">
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-2/3 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-1/3 px-2 py-2 border-t border-b border-r border-gray-300 rounded-r-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          <label className="block mb-1 text-xs font-semibold text-slate-500 uppercase">Preço Un. (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="0,00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end md:col-span-1">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
            title="Adicionar Produto"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemForm;
