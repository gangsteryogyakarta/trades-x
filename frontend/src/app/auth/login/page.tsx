"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { api } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const response = await api.login(email, password)

    if (response.error) {
      setError(response.error)
      setLoading(false)
      return
    }

    // Redirect to dashboard on success
    router.push("/dashboard")
  }

  return (
    <Card className="border-[#3B82F6]/20 bg-[#1E293B]/60 backdrop-blur-xl shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tighter text-white">
          Access Command Center
        </CardTitle>
        <CardDescription className="text-slate-400">
          Enter your credentials to access the AI Co-Pilot
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trader" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#0F172A]/50 mb-4">
            <TabsTrigger value="trader">Trader</TabsTrigger>
            <TabsTrigger value="admin">Administrator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trader">
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                {error && (
                  <div className="p-3 text-sm text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-md">
                    {error}
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email" className="text-slate-200">Email Signal</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="pilot@trades-x.com" 
                    className="bg-[#0F172A]/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-[#00FF9D]"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="text-slate-200">Security Key</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="bg-[#0F172A]/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-[#00FF9D]"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] disabled:opacity-50"
                >
                  {loading ? "Initiating..." : "Initiate Session"}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
             <div className="p-4 text-center text-sm text-slate-500">
                Admin access requires YubiKey authentication.
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-xs text-slate-500">
          No access? <Link href="/auth/register" className="text-[#00FF9D] hover:underline">Request Clearance</Link>
        </div>
      </CardFooter>
    </Card>
  )
}
