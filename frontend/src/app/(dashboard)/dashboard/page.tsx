import { Card } from "@/components/ui/card"
import { TradingChart } from "@/components/dashboard/TradingChart"
import { RiskHUD } from "@/components/dashboard/RiskHUD"
import { RecentActivity } from "@/components/dashboard/RecentActivity"

export default function DashboardPage() {
  return (
    <div className="space-y-12 pt-8"> {/* Added padding top for floating headers */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">Command Center</h2>
            <div className="text-sm text-slate-400 font-mono border border-white/10 px-4 py-2 rounded-full bg-black/40">
                MARKET STATUS: <span className="text-[#10b981] font-bold animate-pulse">OPEN</span>
            </div>
        </div>
        
        {/* Main Modules - High Contrast Layout */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Balance Card */}
            <div className="card-panel p-6 pt-10 flex flex-col items-center justify-center min-h-[160px]">
                <div className="card-header-pill shadow-amber-500/20">Account Balance</div>
                <div className="text-center">
                   <div className="text-4xl font-black text-black tracking-tight">$24,562.<span className="text-2xl text-slate-500">00</span></div>
                   <div className="text-sm font-bold text-[#10b981] mt-2 bg-[#10b981]/10 px-3 py-1 rounded-full inline-block">+2.4% today</div>
                </div>
            </div>

            {/* Active Positions */}
            <div className="card-panel p-6 pt-10 flex flex-col items-center justify-center min-h-[160px]">
                 <div className="card-header-pill from-slate-800 to-slate-900 text-white shadow-slate-900/20">Active Positions</div>
                 <div className="text-center">
                    <div className="text-5xl font-black text-slate-900 mt-1">4</div>
                    <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">2 Long • 2 Short</div>
                 </div>
            </div>

             {/* Daily PnL */}
            <div className="card-panel p-6 pt-10 flex flex-col items-center justify-center min-h-[160px] relative group">
                <div className="card-header-pill from-[#10b981] to-[#059669] text-white shadow-emerald-500/20">Daily Profit</div>
                <div className="text-center relative z-10">
                    <div className="text-4xl font-black text-[#059669] tracking-tight">+$432.50</div>
                </div>
                 {/* Background Glow Container */}
                 <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#10b981]/5 to-transparent opacity-50" />
                 </div>
            </div>

            {/* Risk Exposure */}
             <div className="card-panel p-6 pt-10 flex flex-col items-center justify-center min-h-[160px]">
                <div className="card-header-pill from-[#ef4444] to-[#b91c1c] text-white shadow-red-500/20">Total Risk</div>
                <div className="text-center relative z-10">
                    <div className="text-4xl font-black text-[#b91c1c] tracking-tight">1.2%</div>
                    <div className="text-xs font-bold text-[#ef4444] mt-2 uppercase tracking-wide">VaR Exposure</div>
                </div>
            </div>
        </div>



        {/* Chart + Activity Area vs Risk Matrix */}
        <div className="grid gap-8 md:grid-cols-7 lg:grid-cols-8 items-start">
            <div className="col-span-5 lg:col-span-6 flex flex-col gap-8 h-[750px]">
                {/* 1. Chart Section (Top Half) */}
                <div className="flex-1 card-panel p-6 flex flex-col relative">
                     {/* Chart Header Title Row */}
                     <div className="flex items-center justify-between mb-4 z-20">
                        <div className="flex items-center gap-3">
                             <div className="card-header-pill static translate-x-0 translate-y-0 shadow-amber-500/20 text-xs py-1 px-4 mb-0">BTC/USD</div>
                             <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200 tracking-wider">LIVE MARKET</span>
                        </div>
                     </div>

                     {/* Chart Inner Container */}
                     <div className="flex-1 w-full bg-slate-50 rounded-lg border border-slate-100 overflow-hidden relative">
                        <TradingChart />
                     </div>
                </div>

                {/* 2. Recent Activity Section (Bottom Half) */}
                <div className="flex-1 card-panel p-6 overflow-hidden">
                    <RecentActivity />
                </div>
            </div>

            {/* Right Column: Risk Matrix (Full Height) */}
            <div className="col-span-2 lg:col-span-2 h-[750px] card-panel p-4 flex flex-col relative">
                 <div className="card-header-pill from-[#ef4444] to-[#b91c1c] text-white shadow-red-500/20 top-[-14px]">Risk Matrix</div>
                <div className="flex-1 pt-12">
                     <RiskHUD />
                </div>
            </div>
        </div>
    </div>
  )
}
