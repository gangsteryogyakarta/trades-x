"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

interface OrderModalProps {
  stock?: {
    id: number
    symbol: string
    name: string
    price: number
  }
  trigger?: React.ReactNode
}

export function OrderModal({ stock, trigger }: OrderModalProps) {
  const [open, setOpen] = useState(false)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState(stock?.price?.toString() || "")
  const [orderMode, setOrderMode] = useState<"market" | "limit">("market")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const totalValue = (parseFloat(quantity) || 0) * (parseFloat(price) || 0)

  const handleSubmit = async () => {
    if (!stock) return
    
    setLoading(true)
    setError("")

    const response = await api.placeOrder(
      stock.id,
      orderType,
      parseInt(quantity),
      parseFloat(price),
      orderMode
    )

    if (response.error) {
      setError(response.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
      setQuantity("")
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">Trade</Button>}
      </DialogTrigger>
      <DialogContent className="bg-[#0F172A] border-[#1E293B] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
              <span className="font-bold text-[#3B82F6]">{stock?.symbol?.slice(0, 2) || "TX"}</span>
            </div>
            <div>
              <div className="text-lg">{stock?.symbol || "Select Stock"}</div>
              <div className="text-sm text-slate-400 font-normal">{stock?.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#00FF9D]/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-[#00FF9D]" />
            </div>
            <h3 className="text-xl font-bold text-[#00FF9D]">Order Placed!</h3>
            <p className="text-slate-400 mt-2">Your {orderType} order has been submitted</p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Buy/Sell Toggle */}
            <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "buy" | "sell")}>
              <TabsList className="grid grid-cols-2 w-full bg-[#1E293B]">
                <TabsTrigger 
                  value="buy" 
                  className="data-[state=active]:bg-[#00FF9D] data-[state=active]:text-slate-900 font-bold"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  BUY
                </TabsTrigger>
                <TabsTrigger 
                  value="sell"
                  className="data-[state=active]:bg-[#FF3B30] data-[state=active]:text-white font-bold"
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  SELL
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Order Mode */}
            <div className="flex gap-2">
              <Button
                variant={orderMode === "market" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderMode("market")}
                className={orderMode === "market" ? "bg-[#3B82F6]" : "border-slate-700 text-slate-400"}
              >
                Market
              </Button>
              <Button
                variant={orderMode === "limit" ? "default" : "outline"}
                size="sm"
                onClick={() => setOrderMode("limit")}
                className={orderMode === "limit" ? "bg-[#3B82F6]" : "border-slate-700 text-slate-400"}
              >
                Limit
              </Button>
            </div>

            {error && (
              <div className="p-3 text-sm text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <Label className="text-slate-400">Quantity (Lot)</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="bg-[#1E293B] border-slate-700 text-white text-xl font-mono h-12"
              />
              <div className="flex gap-2">
                {[10, 50, 100, 500].map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(q.toString())}
                    className="border-slate-700 text-slate-400 hover:text-white flex-1"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="text-slate-400">
                {orderMode === "market" ? "Estimated Price" : "Limit Price"}
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={orderMode === "market"}
                className="bg-[#1E293B] border-slate-700 text-white text-xl font-mono h-12"
              />
            </div>

            {/* Summary */}
            <div className="bg-[#1E293B] rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Order Type</span>
                <span className="text-white">{orderMode.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estimated Total</span>
                <span className="text-white font-mono">Rp {totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fee (0.15%)</span>
                <span className="text-white font-mono">Rp {(totalValue * 0.0015).toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className={orderType === "buy" ? "text-[#00FF9D]" : "text-[#FF3B30]"}>
                    Rp {(totalValue * (orderType === "buy" ? 1.0015 : 0.9985)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !quantity || !price}
              className={`w-full h-12 font-bold text-lg ${
                orderType === "buy" 
                  ? "bg-[#00FF9D] hover:bg-[#00cc7d] text-slate-900" 
                  : "bg-[#FF3B30] hover:bg-[#e0342b] text-white"
              }`}
            >
              {loading ? "Processing..." : `${orderType.toUpperCase()} ${stock?.symbol || ""}`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
