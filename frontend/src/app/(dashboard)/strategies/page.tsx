"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pause, Play, Settings, Trash2, TrendingUp, BarChart3, Zap } from "lucide-react"

interface Strategy {
  id: number
  name: string
  type: "momentum" | "meanreversion" | "breakout" | "custom"
  status: "active" | "paused" | "stopped"
  pnl: number
  pnlPercent: number
  trades: number
  winRate: number
  description: string
}

const MOCK_STRATEGIES: Strategy[] = [
  {
    id: 1,
    name: "RSI Momentum",
    type: "momentum",
    status: "active",
    pnl: 4250000,
    pnlPercent: 12.5,
    trades: 48,
    winRate: 65,
    description: "Buy when RSI < 30, Sell when RSI > 70. Applied to BBCA, BBRI, TLKM."
  },
  {
    id: 2,
    name: "Golden Cross",
    type: "breakout",
    status: "active",
    pnl: 2100000,
    pnlPercent: 8.2,
    trades: 12,
    winRate: 75,
    description: "Buy when 50 MA crosses above 200 MA. Long-term trend following."
  },
  {
    id: 3,
    name: "Mean Reversion",
    type: "meanreversion",
    status: "paused",
    pnl: -850000,
    pnlPercent: -3.1,
    trades: 32,
    winRate: 45,
    description: "Trade bounces from Bollinger Bands. Currently paused for review."
  },
  {
    id: 4,
    name: "Crypto Scalper",
    type: "custom",
    status: "stopped",
    pnl: 0,
    pnlPercent: 0,
    trades: 0,
    winRate: 0,
    description: "High-frequency scalping on BTC/ETH. Waiting for API integration."
  },
]

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState(MOCK_STRATEGIES)

  const toggleStatus = (id: number) => {
    setStrategies(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-600 border-emerald-200"
      case "paused": return "bg-amber-100 text-amber-600 border-amber-200"
      default: return "bg-slate-100 text-slate-500 border-slate-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "momentum": return <TrendingUp className="h-5 w-5" />
      case "breakout": return <BarChart3 className="h-5 w-5" />
      default: return <Settings className="h-5 w-5" />
    }
  }

  const totalPnL = strategies.reduce((sum, s) => sum + s.pnl, 0)
  const activeCount = strategies.filter(s => s.status === "active").length

  return (
    <div className="space-y-8 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">Bot Strategies</h2>
            <p className="text-slate-300 text-sm mt-1">Manage your algorithmic trading fleet</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 rounded-full px-6">
          <Plus className="h-4 w-4 mr-2" />
          New Strategy
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card-panel p-6 pt-10 relative">
          <div className="card-header-pill shadow-emerald-500/20 from-emerald-500 to-emerald-600 text-white">Active Bots</div>
           <div className="flex justify-between items-start mb-2">
             <Zap className="h-5 w-5 text-emerald-500 opacity-50" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{activeCount}</div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Running 24/7</p>
        </div>

        <div className="card-panel p-6 pt-10 relative">
         <div className="card-header-pill shadow-blue-500/20 from-blue-500 to-blue-600 text-white">Total P&L</div>
           <div className="flex justify-between items-start mb-2">
             <TrendingUp className="h-5 w-5 text-blue-500 opacity-50" />
          </div>
          <div className={`text-3xl font-black font-mono tracking-tight ${totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}Rp {totalPnL.toLocaleString()}
          </div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">All Strategies</p>
        </div>

        <div className="card-panel p-6 pt-10 relative">
         <div className="card-header-pill shadow-slate-500/20 from-slate-700 to-slate-800 text-white">Total Trades</div>
           <div className="flex justify-between items-start mb-2">
             <BarChart3 className="h-5 w-5 text-slate-500 opacity-50" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
            {strategies.reduce((sum, s) => sum + s.trades, 0)}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Executed Orders</p>
        </div>
      </div>

      {/* Strategy List */}
      <div className="space-y-4">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="card-panel p-6 transition-all hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left: Info */}
                <div className="flex items-start gap-5">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border shadow-sm ${
                    strategy.status === "active" ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"
                  }`}>
                    {getTypeIcon(strategy.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-slate-900">{strategy.name}</h3>
                      <Badge className={`border font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide ${getStatusColor(strategy.status)}`}>
                        {strategy.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-slate-500 max-w-xl leading-relaxed">{strategy.description}</p>
                    
                    {/* Stats Grid */}
                    <div className="flex items-center gap-8 mt-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Net P&L</div>
                        <div className={`font-mono font-bold text-base ${strategy.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {strategy.pnl >= 0 ? '+' : ''}Rp {strategy.pnl.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Win Rate</div>
                        <div className="font-mono font-bold text-base text-slate-700">{strategy.winRate}%</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Trades</div>
                        <div className="font-mono font-bold text-base text-slate-700">{strategy.trades}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => toggleStatus(strategy.id)}
                    className={`flex-1 lg:flex-none font-bold border-2 ${strategy.status === "active" 
                      ? "border-amber-100 text-amber-600 hover:bg-amber-50 hover:text-amber-700" 
                      : "border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                    disabled={strategy.status === "stopped"}
                  >
                    {strategy.status === "active" ? (
                      <><Pause className="h-4 w-4 mr-2" /> PAUSE BOT</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> RESUME BOT</>
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  )
}
