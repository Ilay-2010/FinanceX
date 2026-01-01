
import React, { useState, useMemo } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  Activity,
  Zap,
  ShieldCheck,
  CalendarDays,
  Circle,
  Plus,
  Trash2
} from 'lucide-react';
import { FinanceData, TransactionType } from '../types';
import TransactionForm from './TransactionForm';
import ScrollReveal from './ScrollReveal';
import StarBorder from './StarBorder';
import CountUp from './CountUp';

interface DashboardProps {
  data: FinanceData;
  totalBalance: number;
  addTransaction: (t: any) => void;
  deleteTransaction: (id: string) => void;
  theme: string;
}

const Dashboard: React.FC<DashboardProps> = ({ data, totalBalance, addTransaction, deleteTransaction }) => {
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const income = data.transactions.filter(t => t.type === TransactionType.INCOME).reduce((a, b) => a + b.amount, 0);
    const expense = data.transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((a, b) => a + b.amount, 0);
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentExpenses = data.transactions
      .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date) > thirtyDaysAgo)
      .reduce((a, b) => a + b.amount, 0);
    const dailyBurn = recentExpenses / 30;

    const now = new Date();
    const daysRemaining = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate();
    const recurringIn = data.recurring.filter(r => r.type === TransactionType.INCOME).reduce((a,b) => a + b.amount, 0);
    const recurringOut = data.recurring.filter(r => r.type === TransactionType.EXPENSE).reduce((a,b) => a + b.amount, 0);
    const projectedEnd = totalBalance + recurringIn - recurringOut - (dailyBurn * daysRemaining);

    const coverageDays = dailyBurn > 0 ? totalBalance / dailyBurn : 365;
    const healthScore = Math.min(100, (coverageDays / 180) * 100);

    return { income, expense, savingsRate, dailyBurn, projectedEnd, healthScore };
  }, [data.transactions, data.recurring, totalBalance]);

  return (
    <div className="space-y-12 md:space-y-16 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <ScrollReveal>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-tight">Status</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Operational System Integrity.</p>
        </ScrollReveal>
        
        <StarBorder 
          as="button" 
          onClick={() => setShowForm(true)} 
          color="#FF9FFC" 
          speed="3s" 
          className="rounded-full overflow-hidden shadow-[0_10px_40px_-10px_rgba(255,159,252,0.4)] w-full md:w-auto"
        >
          <div className="px-6 md:px-10 py-3.5 md:py-4 bg-accent text-black font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-white transition-all active:scale-95">
            <Plus size={20} strokeWidth={3} />
            Inject Entry
          </div>
        </StarBorder>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
        <MetricItem label="Equity" value={totalBalance} icon={<TrendingUp size={18} />} accent prefix="$" />
        <MetricItem label="Projection" value={stats.projectedEnd} icon={<CalendarDays size={18} />} prefix="$" />
        <MetricItem label="Burn Rate" value={stats.dailyBurn} icon={<Zap size={18} />} color="text-rose-500" prefix="$" />
        <MetricItem label="Health Index" value={stats.healthScore} icon={<ShieldCheck size={18} />} color="text-emerald-400" decimals={0} prefix="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <ScrollReveal className="flex items-center gap-3">
            <Circle className="w-2 h-2 fill-accent text-accent" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Ledger Feed</h3>
          </ScrollReveal>
          
          <div className="space-y-3">
            {data.transactions.length > 0 ? data.transactions.slice(0, 6).map(t => (
              <StarBorder key={t.id} className="rounded-2xl" color={t.type === TransactionType.INCOME ? '#10b981' : '#f43f5e'}>
                <div className="flex items-center justify-between p-4 md:p-5 bg-black border border-white/5 rounded-[inherit] group">
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className={`shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-white text-sm md:text-base truncate">{t.description}</p>
                      <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <div className="text-right">
                      <p className={`font-mono font-bold text-base md:text-lg ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-white'}`}>
                        {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-slate-800 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
                    >
                      <Trash2 size={16} />
                    </button>
                    {/* Always visible on mobile */}
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-slate-600 active:text-rose-500 block sm:hidden"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </StarBorder>
            )) : (
              <div className="py-24 text-center text-slate-600 font-bold border-2 border-dashed border-white/5 rounded-[40px]">
                Vault is currently empty.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10 md:space-y-12">
           <ScrollReveal className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Performance</h3>
           </ScrollReveal>
           
           <div className="space-y-8 md:space-y-10">
              <ProgressBar label="Savings Rate" value={stats.savingsRate} />
              <ProgressBar label="Efficiency Score" value={stats.healthScore} />
           </div>

           <div className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">
                <span>Tier Analysis</span>
                <span className="text-accent font-bold">QUANTUM-READY</span>
              </div>
              <div className="flex gap-1.5 h-1">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`flex-1 rounded-full ${i <= 4 ? 'bg-accent' : 'bg-white/5'}`}></div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-6 overflow-y-auto">
          <div className="w-full max-w-xl my-auto">
            <TransactionForm onClose={() => setShowForm(false)} onSubmit={(t) => { addTransaction(t); setShowForm(false); }} />
          </div>
        </div>
      )}
    </div>
  );
};

const MetricItem = ({ label, value, icon, color, accent, prefix = '$', decimals = 2 }: any) => (
  <div className="flex flex-col items-start group cursor-default">
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500 border border-white/10 bg-white/5 ${accent ? 'text-accent shadow-[0_0_20px_rgba(255,159,252,0.1)] group-hover:scale-110' : 'text-slate-400 group-hover:bg-white/10 group-hover:text-white'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 16 })}
    </div>
    <p className="text-slate-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-1 md:mb-2">{label}</p>
    <p className={`text-2xl md:text-4xl font-bold tracking-tighter mono ${accent ? 'text-accent' : (color || 'text-white')}`}>
      <CountUp to={value} prefix={prefix} decimals={decimals} />
    </p>
  </div>
);

const ProgressBar = ({ label, value }: any) => (
  <div className="space-y-3 md:space-y-4">
    <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-white font-mono">{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div className="h-full bg-accent transition-all duration-1000 ease-out" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
