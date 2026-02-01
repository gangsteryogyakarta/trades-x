import Link from "next/link"
import { Sparkles, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-reference flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content Container */}
      <div className="z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-xs font-bold text-slate-300 tracking-[0.2em] uppercase">Phase 1: Deep Intelligence Live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
          TRADES<span className="text-purple-500">-</span>X
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate executive command center for elite traders. 
          Powered by <span className="text-white font-bold">Explainable AI (XAI)</span> and institutional-grade risk management.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/dashboard" className="group relative px-8 py-4 bg-white text-slate-900 font-black rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2">
            ENTER COMMAND CENTER
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center gap-8 text-slate-500 font-mono text-xs tracking-widest uppercase py-4 border-l border-white/10 pl-8 hidden md:flex">
                <div className="flex flex-col items-start">
                    <span className="text-white font-bold">STABLE</span>
                    <span>BACKEND</span>
                </div>
                <div className="flex flex-col items-start border-l border-white/10 pl-8">
                    <span className="text-white font-bold">LIVE</span>
                    <span>SIGNALS</span>
                </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="card-panel p-6 border-white/5 bg-white/5 backdrop-blur-xl group hover:border-purple-500/50 transition-all cursor-default">
            <TrendingUp className="h-8 w-8 text-purple-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Alpha Scanner</h3>
            <p className="text-slate-400 text-sm">Identifying edge-cases and breakouts before the retail market reacts.</p>
        </div>
        <div className="card-panel p-6 border-white/5 bg-white/5 backdrop-blur-xl group hover:border-emerald-500/50 transition-all cursor-default">
            <Shield className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-white font-bold mb-2">Risk Matrix</h3>
            <p className="text-slate-400 text-sm">Real-time VaR analysis and exposure limits to protect your capital.</p>
        </div>
        <div className="card-panel p-6 border-white/5 bg-white/5 backdrop-blur-xl group hover:border-amber-500/50 transition-all cursor-default">
            <Zap className="h-8 w-8 text-amber-400 mb-4" />
            <h3 className="text-white font-bold mb-2">AI Co-Pilot</h3>
            <p className="text-slate-400 text-sm">Conversation-based market reasoning with deep pattern recognition.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 text-[10px] text-slate-600 font-mono tracking-widest uppercase">
          &copy; 2024 TRADES-X EXECUTIVE // ALL SYSTEMS OPERATIONAL
      </footer>
    </div>
  )
}
