"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const Gauge = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="10" 
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 font-mono">{value}%</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="mt-2">
         {value > 80 ? (
             <Badge className="bg-[#FF3B30]/10 text-[#FF3B30] border-0 hover:bg-[#FF3B30]/20 font-bold px-3 py-1">CRITICAL</Badge>
         ) : value > 50 ? (
             <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-0 hover:bg-[#F59E0B]/20 font-bold px-3 py-1">WARNING</Badge>
         ) : (
             <Badge className="bg-[#00FF9D]/10 text-[#059669] border-0 hover:bg-[#00FF9D]/20 font-bold px-3 py-1">SAFE</Badge>
         )}
      </div>
    </div>
  )
}

const OrderBookHeatmap = () => {
    return (
        <div className="space-y-2 mt-8">
            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider text-center">Liquidity Heatmap</h4>
            {[...Array(8)].map((_, i) => { 
                const isBuy = i > 3
                const width = Math.floor(Math.random() * 80) + 20
                const color = isBuy ? "bg-[#00FF9D]" : "bg-[#FF3B30]"
                return (
                    <div key={i} className="flex items-center gap-2 h-2">
                        <div className="flex-1 bg-slate-100 h-full rounded-sm overflow-hidden relative">
                            <div 
                                className={`absolute ${isBuy ? 'left-0' : 'right-0'} top-0 bottom-0 ${color} opacity-60`} 
                                style={{ width: `${width}%` }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export function RiskHUD() {
  return (
    <div className="h-full w-full flex flex-col justify-between py-6">
      {/* Gauges */}
      <div className="grid grid-cols-1 gap-8">
          <Gauge value={42} label="Margin Used" color="#3B82F6" />
          <Gauge value={12} label="Daily VaR" color="#00FF9D" />
      </div>

      {/* Heatmap */}
      <OrderBookHeatmap />

      {/* Quick Actions */}
      <div className="pt-8 mt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider text-center">Emergency Protocol</h4>
          <button className="w-full py-4 bg-[#FF3B30] text-white rounded-xl shadow-xl shadow-red-500/30 hover:bg-[#b91c1c] text-sm font-bold transition-all uppercase tracking-widest active:scale-95">
              Flatten All Positions
          </button>
      </div>
    </div>
  )
}
