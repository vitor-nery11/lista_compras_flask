import React from 'react';

const Summary = ({ total, budget, purchasedCount, totalItems }) => {
  const remaining = budget !== null ? budget - total : null;
  const isOverBudget = remaining !== null && remaining < 0;

  return (
    <div className="grid grid-cols-1 gap-4 p-6 mb-8 text-white md:grid-cols-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl">
        <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Orçamento</p>
        <p className="text-2xl font-bold">
          {budget !== null ? `R$ ${budget.toFixed(2).replace('.', ',')}` : 'Não definido'}
        </p>
      </div>
      
      <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl">
        <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Total da Lista</p>
        <p className="text-2xl font-bold">
          R$ {total.toFixed(2).replace('.', ',')}
        </p>
      </div>
      
      <div className={`p-4 backdrop-blur-md rounded-xl transition-colors ${isOverBudget ? 'bg-red-500/80 shadow-inner' : 'bg-white/10'}`}>
        <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">
          {isOverBudget ? 'Excedido' : 'Restante'}
        </p>
        <p className="text-2xl font-bold">
          {remaining !== null 
            ? `R$ ${Math.abs(remaining).toFixed(2).replace('.', ',')}` 
            : '-'}
        </p>
      </div>

      <div className="col-span-1 md:col-span-3 flex justify-between items-center text-sm font-medium mt-2 pt-4 border-t border-white/20">
        <span>{totalItems} produto{totalItems !== 1 ? 's' : ''} no total</span>
        <span className="bg-white/20 px-3 py-1 rounded-full">{purchasedCount} comprado{purchasedCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
};

export default Summary;
