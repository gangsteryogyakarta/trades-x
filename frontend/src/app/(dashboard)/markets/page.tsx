"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderModal } from "@/components/dashboard/OrderModal"
import { TrendingUp, TrendingDown, Search, Star, BarChart3 } from "lucide-react"
import { api } from "@/lib/api"

interface Stock {
  id: number
  ticker: string
  name: string
  sector: string
  last_price: number
  previous_close: number
  change_percentage: number
  volume: number
}

export default function MarketsPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    fetchStocks()
  }, [searchQuery])

  const fetchStocks = async () => {
    setLoading(true)
    const response = await api.getStocks(searchQuery)
    if (response.data) {
      setStocks(response.data)
    }
    setLoading(false)
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const filteredStocks = activeTab === "favorites" 
    ? stocks.filter(s => favorites.includes(s.id))
    : activeTab === "all" 
      ? stocks 
      : stocks.filter(s => s.sector === activeTab)

  const sectors = [...new Set(stocks.map(s => s.sector))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Markets</h2>
          <p className="text-slate-400 text-sm">Browse and trade stocks, crypto, and commodities</p>
        </div>
        <Badge className="bg-[#00FF9D]/20 text-[#00FF9D] border-0">
          {stocks.length} Assets
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by symbol or name..."
          className="pl-10 bg-[#1E293B] border-slate-700 text-white"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1E293B]/50 flex-wrap h-auto">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#3B82F6]">All</TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-[#3B82F6]">
            <Star className="h-3 w-3 mr-1" />
            Watchlist
          </TabsTrigger>
          {sectors.map(sector => (
            <TabsTrigger key={sector} value={sector} className="data-[state=active]:bg-[#3B82F6]">
              {sector}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : filteredStocks.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No stocks found</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredStocks.map((stock) => (
                <Card key={stock.id} className="bg-[#1E293B]/50 border-[#1E293B] hover:border-[#3B82F6]/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                          <span className="font-bold text-[#3B82F6] text-sm">{stock.ticker.slice(0, 2)}</span>
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{stock.ticker}</CardTitle>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">{stock.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(stock.id)}
                        className={favorites.includes(stock.id) ? "text-yellow-500" : "text-slate-600"}
                      >
                        <Star className="h-4 w-4" fill={favorites.includes(stock.id) ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-white font-mono">
                          Rp {stock.last_price.toLocaleString()}
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                          stock.change_percentage >= 0 ? 'text-[#00FF9D]' : 'text-[#FF3B30]'
                        }`}>
                          {stock.change_percentage >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {stock.change_percentage >= 0 ? '+' : ''}{stock.change_percentage}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Volume</div>
                        <div className="text-sm text-slate-400 font-mono">
                          {(stock.volume / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <OrderModal 
                        stock={{ id: stock.id, symbol: stock.ticker, name: stock.name, price: stock.last_price }}
                        trigger={
                          <Button className="flex-1 bg-[#00FF9D] hover:bg-[#00cc7d] text-slate-900 font-bold">
                            BUY
                          </Button>
                        }
                      />
                      <OrderModal 
                        stock={{ id: stock.id, symbol: stock.ticker, name: stock.name, price: stock.last_price }}
                        trigger={
                          <Button variant="outline" className="flex-1 border-[#FF3B30] text-[#FF3B30] hover:bg-[#FF3B30]/10">
                            SELL
                          </Button>
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
