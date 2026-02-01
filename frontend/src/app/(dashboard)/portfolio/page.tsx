"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { TrendingUp, TrendingDown, Wallet, PieChart, Activity } from "lucide-react"

interface Position {
  id: number
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

export default function PortfolioPage() {
  const [walletBalance, setWalletBalance] = useState(0)
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // Fetch wallet balance
    const walletRes = await api.getWalletBalance()
    if (walletRes.data?.balance !== undefined) {
      setWalletBalance(walletRes.data.balance)
    }

    // Mock positions (in a real app, this would come from an API)
    setPositions([
      { id: 1, symbol: "BBCA", name: "Bank Central Asia", quantity: 100, avgPrice: 9500, currentPrice: 9875, pnl: 37500, pnlPercent: 3.95 },
      { id: 2, symbol: "TLKM", name: "Telkom Indonesia", quantity: 500, avgPrice: 4100, currentPrice: 3980, pnl: -60000, pnlPercent: -2.93 },
      { id: 3, symbol: "BBRI", name: "Bank Rakyat Indonesia", quantity: 200, avgPrice: 5600, currentPrice: 5825, pnl: 45000, pnlPercent: 4.02 },
      { id: 4, symbol: "GOTO", name: "GoTo Gojek Tokopedia", quantity: 10000, avgPrice: 85, currentPrice: 72, pnl: -130000, pnlPercent: -15.29 },
    ])

    setLoading(false)
  }

  const totalValue = positions.reduce((sum, p) => sum + (p.quantity * p.currentPrice), 0)
  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0)
  const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0

  return (
    <div className="space-y-8 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">Portfolio Overview</h2>
        <div className="text-sm text-slate-400 font-mono border border-white/10 px-4 py-2 rounded-full bg-black/40 flex items-center gap-2">
            <span>LAST UPDATE:</span>
            <span className="text-white font-bold">JUST NOW</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Wallet Balance */}
        <div className="card-panel p-6 pt-10 relative">
          <div className="card-header-pill shadow-blue-500/20 from-blue-600 to-blue-700 text-white">Wallet Balance</div>
          <div className="flex justify-between items-start mb-2">
             <Wallet className="h-5 w-5 text-blue-600 opacity-50" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            Rp {walletBalance.toLocaleString()}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Available for trading</p>
        </div>

        {/* Portfolio Value */}
        <div className="card-panel p-6 pt-10 relative">
          <div className="card-header-pill shadow-emerald-500/20 from-[#10b981] to-[#059669] text-white">Total Value</div>
          <div className="flex justify-between items-start mb-2">
             <PieChart className="h-5 w-5 text-emerald-600 opacity-50" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
             Rp {totalValue.toLocaleString()}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{positions.length} Active Positions</p>
        </div>

        {/* Total P&L */}
        <div className="card-panel p-6 pt-10 relative">
          <div className="card-header-pill shadow-amber-500/20 from-amber-500 to-amber-600 text-white">Net P&L</div>
           <div className="flex justify-between items-start mb-2">
             <Activity className="h-5 w-5 text-amber-600 opacity-50" />
          </div>
          <div className={`text-2xl font-black font-mono tracking-tight ${totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalPnL >= 0 ? '+' : ''}Rp {totalPnL.toLocaleString()}
          </div>
           <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${totalPnLPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}% All Time
          </p>
        </div>

        {/* Total Assets */}
        <div className="card-panel p-6 pt-10 relative">
          <div className="card-header-pill shadow-slate-500/20 from-slate-700 to-slate-800 text-white">Net Worth</div>
          <div className="flex justify-between items-start mb-2">
             <TrendingUp className="h-5 w-5 text-slate-600 opacity-50" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
            Rp {(walletBalance + totalValue).toLocaleString()}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Combined Assets</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card-panel p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
             <h3 className="font-bold text-slate-800 text-lg">Current Holdings</h3>
             <button className="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-lg shadow-lg hover:bg-slate-800 transition-colors uppercase tracking-wider">
                Export CSV
             </button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Price</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Current</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                  <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {positions.map((position) => (
                  <tr key={position.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                          <span className="text-xs font-black text-slate-700">{position.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{position.symbol}</div>
                          <div className="text-xs font-medium text-slate-500">{position.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-700">
                      {position.quantity.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-slate-500">
                      Rp {position.avgPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                      Rp {position.currentPrice.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-900">
                      Rp {(position.quantity * position.currentPrice).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className={`font-mono font-bold ${position.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {position.pnl >= 0 ? '+' : ''}Rp {position.pnl.toLocaleString()}
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-end gap-1 mt-1 ${position.pnlPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {position.pnlPercent >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  )
}
