import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import { Transaction, TransactionType } from '../types';
import ScrollReveal from './ScrollReveal';
import StarBorder from './StarBorder';
import { Activity, TrendingUp, PieChart as PieIcon, Calendar } from 'lucide-react';

interface VisualsProps {
  transactions: Transaction[];
}

const Visuals: React.FC<VisualsProps> = ({ transactions }) => {
  // 1. Historical Equity Data (Reconstructing Balance over time)
  const equityTimeline = useMemo(() => {
    if (transactions.length === 0) return [];
    
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let currentBalance = 0;
    const dateMap: Record<string, number> = {};
    
    sorted.forEach(t => {
      const dateKey = new Date(t.date).toISOString().split('T')[0];
      const change = t.type === TransactionType.INCOME ? t.amount : -t.amount;
      currentBalance += change;
      dateMap[dateKey] = currentBalance;
    });

    return Object.entries(dateMap).map(([date, balance]) => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      equity: balance
    })).slice(-15);
  }, [transactions]);

  // 2. Flux Analysis (Monthly Income vs Expense)
  const fluxData = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(t => {
      const d = new Date(t.date);
      const k = `${d.toLocaleString('default', { month: 'short' })}`;
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      if (t.type === TransactionType.INCOME) map[k].income += t.amount;
      else map[k].expense += t.amount;
    });

    return Object.entries(map).map(([name, d]) => ({ name, ...d })).slice(-6);
  }, [transactions]);

  // 3. Sector Distribution (Ranking Categories)
  const sectorData = useMemo(() => {
    const map: Record<string, number> = {};
    const totalExp = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });

    return Object.entries(map)
      .map(([name, value]) => ({ 
        name, 
        value, 
        percentage: totalExp > 0 ? (value / totalExp) * 100 : 0 
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  // 4. Temporal Pulse (Spending by Day of Week)
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map: Record<string, number> = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
    
    transactions.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
      const dayName = days[new Date(t.date).getDay()];
      map[dayName] += t.amount;
    });

    return days.map(d => ({ name: d, value: map[d] }));
  }, [transactions]);

  const COLORS = ['#FF9FFC', '#A3A3A3', '#525252', '#262626', '#171717'];

  return (
    <div className="space-y-16">
      <header>
        <ScrollReveal>
          <h2 className="text-7xl font-bold tracking-tighter mb-4 text-white">Intelligence</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Quantum Data Analytics Layer.</p>
        </ScrollReveal>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Equity Chart */}
        <div className="lg:col-span-12">
          <StarBorder className="rounded-[40px]" color="#FF9FFC" speed="12s">
            <div className="bg-black p-10 h-full">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-accent" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Quantum Drift</h3>
                  </div>
                  <h4 className="text-3xl font-bold tracking-tighter text-white">Equity Timeline</h4>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                   <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold border border-emerald-500/20 uppercase tracking-widest">Live Reconstruction</span>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityTimeline}>
                    <defs>
                      <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9FFC" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF9FFC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="date" stroke="#444" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#666'}} dy={10} />
                    <YAxis stroke="#444" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#666'}} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                    <Tooltip 
                      contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }}
                      itemStyle={{ color: '#FF9FFC', fontWeight: 'bold' }}
                      cursor={{ stroke: '#FF9FFC', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="equity" stroke="#FF9FFC" fill="url(#equityGradient)" strokeWidth={3} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </StarBorder>
        </div>

        {/* Flux Analysis (Flow Drift) */}
        <div className="lg:col-span-7">
          <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 h-full">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp size={14} className="text-accent" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Flow Drift</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fluxData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} 
                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px', textTransform: 'capitalize' }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sector Weight */}
        <div className="lg:col-span-5">
          <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5 h-full">
            <div className="flex items-center gap-2 mb-8">
              <PieIcon size={14} className="text-accent" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sector Weight</h3>
            </div>
            <div className="space-y-6">
              {sectorData.map((sector, idx) => (
                <div key={sector.name} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">{sector.name}</span>
                    <span className="text-white">${sector.value.toLocaleString()} ({Math.round(sector.percentage)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${sector.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
              {sectorData.length === 0 && (
                <p className="text-slate-600 text-center py-24 italic text-sm font-bold uppercase tracking-widest">Insufficient sector data.</p>
              )}
            </div>
          </div>
        </div>

        {/* Temporal Pulse */}
        <div className="lg:col-span-12">
          <div className="bg-[#0A0A0A] p-10 rounded-[40px] border border-white/5">
             <div className="flex items-center gap-2 mb-10">
              <Calendar size={14} className="text-accent" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Temporal Pulse</h3>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dayOfWeekData}>
                  <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="value" 
                    stroke="#FF9FFC" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#FF9FFC', strokeWidth: 0 }} 
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#000' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visuals;