import React from 'react';
import { ArrowRight, Wallet, Zap, Layout, Star } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center">
      <div className="glow top-[-200px] left-[-200px] opacity-40"></div>
      <div className="glow bottom-[-200px] right-[-200px] opacity-40"></div>
      
      <nav className="w-full max-w-7xl px-8 py-8 flex justify-between items-center z-10">
        <ScrollReveal className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,159,252,0.3)]">
            <Wallet className="text-black w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">FinanceX</span>
        </ScrollReveal>
        <button 
          onClick={onEnter}
          className="px-6 py-2 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all font-semibold text-sm text-white"
        >
          Access Vault
        </button>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl z-10 pt-20 pb-40">
        <ScrollReveal stagger={0.2}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-8">
            <Star size={12} className="text-yellow-500" />
            Sovereign Asset Management
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white">
            MONEY <br/>IN MOTION
          </h1>

          <p className="text-neutral-500 text-xl md:text-2xl max-w-2xl mb-14 leading-relaxed font-medium">
            High-performance finance tracking for those who value absolute privacy and world-class aesthetics.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={onEnter}
              className="px-12 py-6 bg-accent text-black rounded-[32px] font-black text-xl hover:scale-105 transition-transform shadow-[0_20px_60px_-15px_rgba(255,159,252,0.3)] flex items-center gap-3"
            >
              Enter System
              <ArrowRight size={24} />
            </button>
          </div>
        </ScrollReveal>
      </section>

      <ScrollReveal stagger={0.2} className="w-full max-w-7xl px-8 pb-32 grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        <FeatureCard 
          icon={<Wallet className="text-white" />}
          title="Cookie-Vault"
          desc="Your data is encrypted and stored in local digital cookies. No clouds, no third parties, no leaks."
        />
        <FeatureCard 
          icon={<Zap className="text-white" />}
          title="Auto-Flow"
          desc="Scheduled assets are processed automatically within your browser's private environment."
        />
        <FeatureCard 
          icon={<Layout className="text-white" />}
          title="Pure Design"
          desc="Everything you need, nothing you don't. A distraction-free workspace for financial precision."
        />
      </ScrollReveal>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div className="glass p-10 rounded-[40px] border-white/5 group hover:border-white/20 transition-all">
    <div className="mb-8 p-4 rounded-[20px] bg-white/5 inline-block group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">{title}</h3>
    <p className="text-neutral-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default LandingPage;