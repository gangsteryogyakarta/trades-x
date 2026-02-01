"use client"

import { Button } from "@/components/ui/button"
import { Bell, Eye, EyeOff, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md px-6">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative w-full">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
           <Input 
             type="search" 
             placeholder="Search symbols, orders, or AI insights..." 
             className="w-full bg-[#18181b]/50 border-0 pl-9 text-white placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-[#f59e0b]"
           />
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        {/* Focus Mode Toggle */}
        <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-[#f59e0b]/50 text-[#f59e0b] hover:bg-[#f59e0b]/10 hover:text-[#fbbf24] transition-colors">
          <Eye className="h-4 w-4" />
          Focus Mode
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-[#f59e0b]/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="@trader" />
                <AvatarFallback className="bg-gradient-to-tr from-[#7f1d1d] to-[#ef4444] text-white font-bold">TF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#09090b] border-[#27272a] text-zinc-300">
            <DropdownMenuLabel className="text-[#f59e0b]">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#27272a]" />
            <DropdownMenuItem className="focus:bg-[#18181b] focus:text-white cursor-pointer">Profile</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[#18181b] focus:text-white cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[#18181b] focus:text-white cursor-pointer">API Keys</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#27272a]" />
            <DropdownMenuItem className="text-[#ef4444] focus:bg-[#ef4444]/10 focus:text-[#ef4444] cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
