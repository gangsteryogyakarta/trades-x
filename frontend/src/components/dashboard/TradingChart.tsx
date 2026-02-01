"use client"

import { useEffect, useRef } from "react"
import { createChart, ColorType, CandlestickSeries, LineSeries } from "lightweight-charts"

export const TradingChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chartContainerRef.current) return

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "#ffffff" },
                textColor: "#334155",
            },
            grid: {
                vertLines: { color: "rgba(226, 232, 240, 0.8)" },
                horzLines: { color: "rgba(226, 232, 240, 0.8)" },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight, // Initial height from container
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: "rgba(226, 232, 240, 1)",
            },
            rightPriceScale: {
                borderColor: "rgba(226, 232, 240, 1)",
            }
        })

        // ... Series definitions ...
        // 1. Candlestick Series (Price)
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#10b981", 
            downColor: "#ef4444", 
            borderVisible: false,
            wickUpColor: "#10b981",
            wickDownColor: "#ef4444",
        })

        // Mock Data Generation
        const currentData = []
        let time = new Date("2024-01-01").getTime() / 1000
        let price = 100
        for (let i = 0; i < 500; i++) {
            const open = price
            const close = price + (Math.random() - 0.5) * 4
            const high = Math.max(open, close) + Math.random() * 2
            const low = Math.min(open, close) - Math.random() * 2
            
            currentData.push({
                time: time + i * 3600, // Hourly
                open,
                high,
                low,
                close,
            })
            price = close
        }
        candlestickSeries.setData(currentData as any)

        // 2. AI Prediction Line (Dashed) - Now GOLD
        const predictionSeries = chart.addSeries(LineSeries, {
            color: "#f59e0b", // Gold/Amber-500
            lineWidth: 2,
            lineStyle: 2, // Dashed
            crosshairMarkerVisible: true,
            title: "AI Forecast (24h)",
        })

        // Projecting from last point
        const lastPoint = currentData[currentData.length - 1]
        const predictions = []
        let predPrice = lastPoint.close
        for(let i = 1; i <= 24; i++) {
             // Upward trend simulation
             predPrice = predPrice + (Math.random() - 0.3) * 2 
             predictions.push({
                 time: (lastPoint.time as number) + i * 3600,
                 value: predPrice
             })
        }
        predictionSeries.setData(predictions as any)

        // Responsive using ResizeObserver
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length === 0 || !entries[0].target) return
            const newRect = entries[0].contentRect
            chart.applyOptions({ 
                width: newRect.width,
                height: newRect.height 
            })
        })

        resizeObserver.observe(chartContainerRef.current)

        return () => {
            resizeObserver.disconnect()
            chart.remove()
        }
    }, [])

    return (
        <div className="relative w-full h-full bg-white">
             {/* Chart Overlay Info */}
             <div className="absolute top-4 right-4 z-10 flex flex-col items-end pointer-events-none">
                <span className="text-2xl font-bold text-slate-800 tracking-tighter">$42,391.50</span>
                <span className="text-sm font-bold text-[#10b981] bg-[#10b981]/10 px-2 rounded">+1.24%</span>
             </div>
             
             <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    )
}
