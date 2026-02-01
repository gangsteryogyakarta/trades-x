"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Search, Filter, Zap, BarChart3, Volume2 } from "lucide-react"

interface ScanResult {
  id: number
  symbol: string
  name: string
  price: number
  change: number
  volume: number
  signal: "bullish" | "bearish" | "neutral"
  pattern?: string
  strength: number
}

const MOCK_BREAKOUTS: ScanResult[] = [
  { id: 1, symbol: "BBRI", name: "Bank Rakyat Indonesia", price: 5825, change: 4.2, volume: 125000000, signal: "bullish", pattern: "Cup & Handle", strength: 85 },
  { id: 2, symbol: "ADRO", name: "Adaro Energy", price: 2890, change: 3.8, volume: 89000000, signal: "bullish", pattern: "Triangle Breakout", strength: 78 },
  { id: 3, symbol: "INCO", name: "Vale Indonesia", price: 4560, change: 2.9, volume: 45000000, signal: "bullish", pattern: "Double Bottom", strength: 72 },
]

const MOCK_VOLUME_SPIKES: ScanResult[] = [
  { id: 4, symbol: "TLKM", name: "Telkom Indonesia", price: 3980, change: -1.2, volume: 320000000, signal: "neutral", strength: 92 },
  { id: 5, symbol: "ANTM", name: "Aneka Tambang", price: 1485, change: 5.5, volume: 280000000, signal: "bullish", strength: 88 },
  { id: 6, symbol: "GOTO", name: "GoTo Gojek Tokopedia", price: 72, change: -8.2, volume: 950000000, signal: "bearish", strength: 95 },
]

const MOCK_OVERSOLD: ScanResult[] = [
  { id: 7, symbol: "UNVR", name: "Unilever Indonesia", price: 4230, change: -2.1, volume: 12000000, signal: "bullish", pattern: "RSI < 30", strength: 82 },
  { id: 8, symbol: "ICBP", name: "Indofood CBP", price: 10850, change: -1.5, volume: 8500000, signal: "bullish", pattern: "Oversold Bounce", strength: 75 },
]

export default function ScannerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("breakouts")

  const getResults = () => {
    switch (activeTab) {
      case "breakouts": return MOCK_BREAKOUTS
      case "volume": return MOCK_VOLUME_SPIKES
      case "oversold": return MOCK_OVERSOLD
      default: return []
    }
  }

  const filteredResults = getResults().filter(r => 
    r.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 pt-8">
       <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">Market Scanner</h2>
            <p className="text-slate-300 text-sm mt-1">Real-time pattern detection dan anomaly alerts</p>
        </div>
        <div className="text-sm text-slate-400 font-mono border border-white/10 px-4 py-2 rounded-full bg-black/40 flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-white font-bold">LIVE SCANNING</span>
        </div>
      </div>

      <div className="card-panel p-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
             {/* Tabs as Pills */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="bg-slate-100 p-1 rounded-full border border-slate-200">
                <TabsTrigger value="breakouts" className="rounded-full px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 font-bold">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Breakouts
                </TabsTrigger>
                <TabsTrigger value="volume" className="rounded-full px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 font-bold">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Volume Spikes
                </TabsTrigger>
                <TabsTrigger value="oversold" className="rounded-full px-4 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 font-bold">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Oversold
                </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Search Input */}
             <div className="relative w-full md:w-96 flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search symbols..."
                        className="pl-10 bg-slate-50 border-slate-200 text-slate-900 focus:ring-slate-200 placeholder:text-slate-400 rounded-lg"
                    />
                </div>
                 <Button variant="outline" className="border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>
        </div>

        {/* Results List */}
        <div className="grid gap-3">
            {filteredResults.map((result) => (
              <div key={result.id} className="group relative bg-white border border-slate-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
                  {/* Hover Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between">
                    {/* Left: Symbol Info */}
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${
                        result.signal === "bullish" ? "bg-emerald-50 border-emerald-100" :
                        result.signal === "bearish" ? "bg-red-50 border-red-100" :
                        "bg-amber-50 border-amber-100"
                      }`}>
                        {result.signal === "bullish" ? (
                          <TrendingUp className="h-6 w-6 text-emerald-500" />
                        ) : result.signal === "bearish" ? (
                          <TrendingDown className="h-6 w-6 text-red-500" />
                        ) : (
                          <BarChart3 className="h-6 w-6 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-lg text-slate-900">{result.symbol}</span>
                          {result.pattern && (
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                              {result.pattern}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-500">{result.name}</span>
                      </div>
                    </div>

                    {/* Middle: Metrics */}
                    <div className="flex items-center gap-12">
                      <div className="text-right min-w-[100px]">
                        <div className="font-mono font-black text-slate-900">Rp {result.price.toLocaleString()}</div>
                        <div className={`text-xs font-bold font-mono ${result.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {result.change >= 0 ? '+' : ''}{result.change}%
                        </div>
                      </div>

                      <div className="text-right hidden lg:block">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Volume</div>
                        <div className="font-mono font-bold text-slate-700">{(result.volume / 1000000).toFixed(1)}M</div>
                      </div>

                      <div className="text-right w-32 hidden md:block">
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Signal Strength</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                result.strength >= 80 ? 'bg-emerald-500' :
                                result.strength >= 60 ? 'bg-amber-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${result.strength}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-900 text-xs">{result.strength}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action */}
                     <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-6 shadow-lg shadow-slate-200">
                        TRADE
                      </Button>
                  </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
