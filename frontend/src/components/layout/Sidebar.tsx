"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  LineChart, 
  Wallet, 
  Settings, 
  Zap, 
  Target,
  LogOut,
  Bot,
  Radar
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Command Center", href: "/dashboard" },
  { icon: Bot, label: "AI Co-Pilot", href: "/copilot" },
  { icon: Radar, label: "Market Scanner", href: "/scanner" },
  { icon: Wallet, label: "Portfolio", href: "/portfolio" },
  { icon: LineChart, label: "Markets", href: "/markets" },
  { icon: Target, label: "Strategies", href: "/strategies" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-[#27272a] bg-[#09090b]/95 backdrop-blur-md md:flex md:w-[280px] md:flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="flex h-16 items-center border-b border-[#27272a] px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-slate-900 border border-[#fcd34d]/30">
            <Zap className="h-5 w-5 fill-current text-white" />
          </div>
          TRADES<span className="text-[#f59e0b]">X</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-2 px-4">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]" 
                    : "text-zinc-400 hover:bg-[#18181b] hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* AI Signal Ticker (Bottom Pinned) */}
      <div className="mt-auto border-t border-[#27272a] bg-[#18181b]/30 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Live Logic</span>
          <Badge variant="outline" className="text-[10px] border-[#f59e0b]/30 text-[#f59e0b] animate-pulse">
            ONLINE
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="rounded-md bg-[#09090b] p-2.5 border border-[#f59e0b]/20 hover:border-[#f59e0b]/40 transition-colors">
            <div className="mb-1 flex items-center gap-2">
              <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b]/20 text-[10px] px-1 py-0 border-0">
                BTC/USD
              </Badge>
              <span className="text-[10px] text-zinc-500 font-mono">12:04:32</span>
            </div>
            <p className="text-xs text-zinc-300 leading-tight">
              Breakout detected on 15m. Volume +450% {'>'}Avg.
            </p>
          </div>
          <div className="rounded-md bg-[#09090b] p-2.5 border border-[#ef4444]/20">
             <div className="mb-1 flex items-center gap-2">
              <Badge className="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 text-[10px] px-1 py-0 border-0">
                RISK ALERT
              </Badge>
              <span className="text-[10px] text-zinc-500 font-mono">12:02:11</span>
            </div>
            <p className="text-xs text-zinc-300 leading-tight">
              Portfolio beta exposure high. Suggest reducing Tech sector.
            </p>
          </div>
        </div>
      </div>
      
      {/* User Mini-Profile */}
       <div className="border-t border-[#27272a] p-4 bg-[#09090b]">
         <div className="flex items-center gap-3">
           <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#7f1d1d] to-[#ef4444] flex items-center justify-center text-xs font-bold text-white border border-[#f59e0b]/30 shadow-lg">
             TF
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-medium text-white">Trader One</span>
             <span className="text-[10px] text-[#f59e0b]">Executive Pro</span>
           </div>
           <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-zinc-400 hover:text-white">
             <LogOut className="h-4 w-4" />
           </Button>
         </div>
       </div>
    </div>
  )
}
