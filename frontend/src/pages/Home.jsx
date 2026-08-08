import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ShoppingList from '../components/ShoppingList';
import { PlusCircle, Loader, ArrowLeft, Calendar, DollarSign, Trash2 } from 'lucide-react';

const Home = () => {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListBudget, setNewListBudget] = useState('');

  const fetchLists = useCallback(async () => {
    try {
      const response = await api.get('/lists');
      setLists(response.data);
    } catch (error) {
      console.error("Error fetching lists", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    
    // Optimistic Update
    const tempId = Date.now();
    const optimisticList = {
      id: tempId,
      name: newListName,
      budget: newListBudget ? parseFloat(newListBudget) : null,
      created_at: new Date().toISOString()
    };
    
    setLists(prev => [optimisticList, ...prev]);
    setActiveListId(tempId);
    setShowCreateForm(false);
    setNewListName('');
    setNewListBudget('');

    try {
      const payload = { name: optimisticList.name };
      if (optimisticList.budget !== null) {
        payload.budget = optimisticList.budget;
      }
      
      const response = await api.post('/lists', payload);
      // Replace with real data
      setLists(prev => prev.map(l => l.id === tempId ? response.data : l));
      setActiveListId(response.data.id);
    } catch (error) {
      console.error("Error creating list", error);
      // Revert
      setLists(prev => prev.filter(l => l.id !== tempId));
      setActiveListId(null);
    }
  };

  const handleDeleteList = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja apagar esta lista? Todos os produtos nela serão perdidos.')) {
      // Optimistic Update
      const listToDelete = lists.find(l => l.id === id);
      setLists(prev => prev.filter(l => l.id !== id));
      if (activeListId === id) setActiveListId(null);

      try {
        await api.delete(`/lists/${id}`);
      } catch (error) {
        console.error("Error deleting list", error);
        // Revert
        if (listToDelete) {
          setLists(prev => [listToDelete, ...prev].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        }
      }
    }
  };

  const handleBack = () => {
    setActiveListId(null);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl px-4 py-8 mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {activeListId && (
            <button 
              onClick={handleBack}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Voltar para as listas"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-3xl font-extrabold text-slate-800">
            {activeListId ? lists.find(l => l.id === activeListId)?.name : '🛒 Minhas Listas'}
          </h1>
        </div>
        
        {!activeListId && !showCreateForm && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nova Lista
          </button>
        )}
      </header>

      {showCreateForm ? (
        <div className="max-w-2xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
          <h2 className="mb-6 text-2xl font-bold text-center text-slate-700">Criar Nova Lista</h2>
          <form onSubmit={handleCreateList} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-600">Nome da Lista</label>
              <input 
                type="text" 
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Ex: Compras do mês"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-600">Orçamento (Opcional)</label>
              <input 
                type="number"
                step="0.01"
                min="0"
                value={newListBudget}
                onChange={(e) => setNewListBudget(e.target.value)}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="flex items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium shadow-md shadow-blue-200"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Criar Lista
              </button>
            </div>
          </form>
        </div>
      ) : activeListId ? (
        <ShoppingList listId={activeListId} listData={lists.find(l => l.id === activeListId)} />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lists.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white border-2 border-dashed rounded-2xl border-slate-200">
              <p className="mb-4 text-slate-500">Você ainda não tem nenhuma lista de compras.</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Criar Minha Primeira Lista
              </button>
            </div>
          ) : (
            lists.map(list => (
              <div 
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 pr-2">
                    {list.name}
                  </h3>
                  <button 
                    onClick={(e) => handleDeleteList(list.id, e)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                    title="Apagar lista"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-auto space-y-2">
                  {list.budget !== null && (
                    <div className="flex items-center text-sm text-slate-600">
                      <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                      Orçamento: <span className="font-semibold ml-1">R$ {list.budget.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex items-center text-xs text-slate-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    Criada em: {new Date(list.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
