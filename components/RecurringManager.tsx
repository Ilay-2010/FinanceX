
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Zap, RefreshCw, X, Check } from 'lucide-react';
import { RecurringTransaction, TransactionType, CATEGORIES } from '../types';
import ScrollReveal from './ScrollReveal';

interface RecurringManagerProps {
  recurringItems: RecurringTransaction[];
  onAdd: (rec: RecurringTransaction) => void;
  onDelete: (id: string) => void;
}

const RecurringManager: React.FC<RecurringManagerProps> = ({ recurringItems, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [day, setDay] = useState(1);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    onAdd({
      id: crypto.randomUUID(),
      description: desc,
      amount: parseFloat(amount),
      category,
      type,
      dayOfMonth: day,
    });
    reset();
  };

  const reset = () => {
    setDesc('');
    setAmount('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <ScrollReveal stagger={0.1}>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Automations</h2>
          <p className="text-neutral-500 font-medium">Schedule your recurring digital asset flow.</p>
        </ScrollReveal>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={`p-3 md:p-4 rounded-2xl transition-all ${showAdd ? 'bg-rose-500/10 text-rose-500 rotate-45' : 'bg-white text-black hover:scale-110 shadow-lg shadow-white/5'}`}
        >
          <Plus size={24} />
        </button>
      </header>

      {showAdd && (
        <ScrollReveal className="glass p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-white/20 animate-in zoom-in-95">
          <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Label</label>
                  <input 
                    value={desc} onChange={e => setDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 focus:outline-none focus:border-white/30 text-lg md:text-xl font-bold"
                    placeholder="Subscription or Bill..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Monthly Flow</label>
                  <input 
                    type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 focus:outline-none focus:border-white/30 text-2xl md:text-3xl font-bold mono"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-4">
                   <button 
                    type="button" 
                    onClick={() => setType(TransactionType.EXPENSE)}
                    className={`flex-1 py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all ${type === TransactionType.EXPENSE ? 'bg-white text-black' : 'bg-white/5 text-neutral-500'}`}
                   >Outflow</button>
                   <button 
                    type="button" 
                    onClick={() => setType(TransactionType.INCOME)}
                    className={`flex-1 py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all ${type === TransactionType.INCOME ? 'bg-white text-black' : 'bg-white/5 text-neutral-500'}`}
                   >Inflow</button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Day of Month Picker</label>
                <div className="grid grid-cols-7 sm:grid-cols-7 gap-1.5 md:gap-2">
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDay(d)}
                      className={`h-9 md:h-10 w-full rounded-lg font-bold text-xs transition-all border ${
                        day === d 
                        ? 'bg-white text-black border-white shadow-lg shadow-white/10' 
                        : 'bg-white/5 text-neutral-500 border-white/5 hover:border-white/20'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-black py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-black text-base md:text-lg hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
              <Check size={20} /> Deploy Automation
            </button>
          </form>
        </ScrollReveal>
      )}

      <ScrollReveal stagger={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recurringItems.length > 0 ? recurringItems.map(item => (
          <div key={item.id} className="glass p-6 rounded-[32px] border-white/5 group hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${item.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                <RefreshCw size={24} className="animate-spin-slow" />
              </div>
              <button onClick={() => onDelete(item.id)} className="p-2 text-neutral-700 hover:text-rose-500 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
            
            <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-1">{item.description}</h4>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-8">{item.category}</p>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 text-neutral-500">
                <Calendar size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Day {item.dayOfMonth}</span>
              </div>
              <p className={`text-xl md:text-2xl font-bold mono ${item.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-white'}`}>
                ${item.amount.toFixed(2)}
              </p>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-24 text-center glass rounded-[40px] border-dashed border-white/10">
            <Zap size={64} className="mx-auto mb-6 text-neutral-900" />
            <p className="text-neutral-500 text-lg font-medium">No automated flows registered.</p>
          </div>
        )}
      </ScrollReveal>
    </div>
  );
};

export default RecurringManager;
