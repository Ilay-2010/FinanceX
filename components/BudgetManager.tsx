
import React, { useState } from 'react';
import { Target, AlertCircle, Plus } from 'lucide-react';
import { Budget, Transaction, TransactionType, CATEGORIES } from '../types';

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onUpdate: (budget: Budget) => void;
}

const BudgetManager: React.FC<BudgetManagerProps> = ({ budgets, transactions, onUpdate }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState(CATEGORIES[0]);
  const [newLimit, setNewLimit] = useState('');

  const spendingByCategory = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleSave = () => {
    if (!newLimit) return;
    onUpdate({ category: newCat, limit: parseFloat(newLimit) });
    setNewLimit('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Budgets</h2>
          <p className="text-neutral-500">Set limits and keep your spending in check.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-3 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl border-white/20 animate-in fade-in zoom-in-95">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-neutral-500">Category</label>
              <select 
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-white/5 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-neutral-500">Monthly Limit</label>
              <input 
                type="number"
                placeholder="Ex: 500"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full bg-white/5 border border-neutral-800 rounded-xl py-3 px-4 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="flex-1 bg-white text-black py-3 rounded-xl font-bold">Set Budget</button>
            <button onClick={() => setShowAdd(false)} className="flex-1 bg-neutral-900 text-white py-3 rounded-xl font-bold border border-neutral-800">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.length > 0 ? (
          budgets.map(budget => {
            const spent = spendingByCategory[budget.category] || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);
            const isOver = spent > budget.limit;

            return (
              <div key={budget.category} className="glass-card rounded-2xl p-6 border-neutral-800 relative overflow-hidden group">
                {isOver && <div className="absolute top-0 right-0 p-2 bg-rose-500 text-[10px] font-bold uppercase tracking-tighter text-white rounded-bl-lg">Over Limit</div>}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold">{budget.category}</h4>
                    <p className="text-neutral-500 text-sm">Monthly Target</p>
                  </div>
                  <Target size={24} className={isOver ? 'text-rose-500' : 'text-neutral-500'} />
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-neutral-400">Spent: ${spent.toFixed(0)}</span>
                    <span className="font-bold">${budget.limit.toFixed(0)}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${isOver ? 'bg-rose-500' : 'bg-white'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {isOver && (
                  <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 p-2 rounded-lg">
                    <AlertCircle size={14} />
                    You've exceeded your budget by ${(spent - budget.limit).toFixed(2)}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 glass-card rounded-2xl p-16 text-center text-neutral-500">
            <Target className="mx-auto mb-4 text-neutral-700" size={48} />
            <p>No budgets set yet. Start by defining your spending goals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
