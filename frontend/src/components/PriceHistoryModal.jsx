import React, { useState, useEffect } from 'react';
import { X, Loader, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const PriceHistoryModal = ({ itemName, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/history/items?name=${encodeURIComponent(itemName)}`);
        
        // Formata os dados para o gráfico
        const formattedData = response.data.map((item, index) => ({
          ...item,
          formattedDate: `${new Date(item.date).toLocaleDateString('pt-BR')} (${item.list_name})`,
          price: item.price
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching price history", error);
      } finally {
        setLoading(false);
      }
    };

    if (itemName) {
      fetchHistory();
    }
  }, [itemName]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white border shadow-md border-slate-200 rounded-xl">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-sm text-slate-600">Lista: {payload[0].payload.list_name}</p>
          <p className="font-bold text-blue-600">
            R$ {payload[0].value.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-slate-400">
            {payload[0].payload.quantity} {payload[0].payload.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="flex items-center text-xl font-bold text-slate-800">
            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
            Histórico de Preços: {itemName}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              Nenhum histórico encontrado para este produto.
            </div>
          ) : data.length === 1 ? (
            <div className="py-12 text-center text-slate-500">
              Este produto só foi comprado uma vez, não há variação de preço ainda.
              <p className="mt-2 font-bold text-slate-700">R$ {data[0].price.toFixed(2).replace('.', ',')}</p>
            </div>
          ) : (
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="formattedDate" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${value}`}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryModal;
