
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { TransactionType, CATEGORIES } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: any) => void;
  onClose: () => void;
}

const MAX_LIMIT = 10000000;

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    
    if (isNaN(val) || val <= 0) {
      setError('Invalid amount.');
      return;
    }

    if (val > MAX_LIMIT) {
      setError(`Max limit is $${MAX_LIMIT.toLocaleString()}`);
      return;
    }
    
    const finalDescription = description.trim() || `Manual ${type === TransactionType.INCOME ? 'Income' : 'Expense'}`;
    
    onSubmit({ 
      amount: val, 
      description: finalDescription, 
      category, 
      type 
    });
  };

  return (
    <div className="glass p-6 md:p-10 rounded-[32px] md:rounded-[40px] border-white/10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <h3 className="text-2xl md:text-3xl font-black tracking-tighter">Journal Entry</h3>
        <button onClick={onClose} className="p-2 md:p-3 rounded-full hover:bg-white/5 text-neutral-500 hover:text-white transition-all">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        <div className="flex p-1 bg-white/5 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              type === TransactionType.EXPENSE ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              type === TransactionType.INCOME ? 'bg-white text-black shadow-lg' : 'text-neutral-500 hover:text-white'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Capital Value</label>
            {error && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">{error}</span>}
          </div>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-neutral-600 group-focus-within:text-white transition-colors">$</span>
            <input
              type="number" 
              step="0.01" 
              required 
              autoFocus
              max={MAX_LIMIT}
              value={amount} 
              onChange={e => {
                setAmount(e.target.value);
                setError('');
              }}
              className="w-full bg-white/5 border border-white/10 rounded-[24px] py-8 pl-14 pr-6 text-4xl md:text-5xl font-bold mono tracking-tighter focus:outline-none focus:border-white/30 transition-all placeholder:text-neutral-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Context</label>
            <input
              type="text"
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium focus:outline-none focus:border-white/30"
              placeholder="What happened?"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Sector</label>
            <select
              value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-medium appearance-none focus:outline-none focus:border-white/30"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black py-6 rounded-[24px] font-black text-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/10"
        >
          <Check size={24} />
          Finalize Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
