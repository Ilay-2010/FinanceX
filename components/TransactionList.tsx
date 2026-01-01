
import React, { useState, useMemo } from 'react';
import { Search, Trash2, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import StarBorder from './StarBorder';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'ALL' || t.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">History</h2>
          <p className="text-neutral-500 font-medium">Review and manage your past activity.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-neutral-600 text-sm"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-white/5 border border-neutral-800 rounded-xl py-2.5 px-4 focus:outline-none focus:border-neutral-600 appearance-none text-xs font-bold uppercase tracking-widest"
          >
            <option value="ALL">All Flows</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expenses</option>
          </select>
        </div>
      </div>

      {/* Desktop View: Ledger Table */}
      <div className="hidden md:block glass rounded-[32px] overflow-hidden border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-white/5">
                <th className="p-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Description</th>
                <th className="p-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Category</th>
                <th className="p-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Date</th>
                <th className="p-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Amount</th>
                <th className="p-5 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(t => (
                  <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${t.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {t.type === TransactionType.INCOME ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                        <span className="font-bold tracking-tight">{t.description}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-[10px] px-3 py-1 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800 font-bold uppercase tracking-widest">
                        {t.category}
                      </span>
                    </td>
                    <td className="p-5 text-sm text-neutral-500 font-mono">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="p-5">
                      <span className={`font-mono font-bold text-base ${t.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-white'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => onDelete(t.id)}
                        className="p-2 text-neutral-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-24 text-center text-neutral-600 font-bold uppercase tracking-widest">
                    No matching activity records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View: High-Fidelity Cards */}
      <div className="md:hidden space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(t => (
            <StarBorder key={t.id} className="rounded-2xl" color={t.type === TransactionType.INCOME ? '#10b981' : '#f43f5e'}>
              <div className="p-5 bg-black border border-white/5 rounded-[inherit] space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base leading-tight">{t.description}</h4>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.category}</p>
                    </div>
                  </div>
                  <button onClick={() => onDelete(t.id)} className="p-2 text-slate-500 active:text-rose-500">
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={12} />
                    <span className="text-[10px] font-mono">{new Date(t.date).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-xl font-bold mono ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-white'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </StarBorder>
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[32px] text-slate-600 font-bold uppercase tracking-widest text-sm">
            Vault records empty.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
