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
import Link from "next/link"
import { api } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFieldErrors({})

    const response = await api.register(name, email, password, confirmPassword)

    if (response.error || response.errors) {
      setError(response.error || "Validation failed")
      setFieldErrors(response.errors || {})
      setLoading(false)
      return
    }

    // Auto-login after registration
    const loginResponse = await api.login(email, password)
    if (loginResponse.access_token) {
      router.push("/dashboard")
    }
  }

  return (
    <Card className="border-[#3B82F6]/20 bg-[#1E293B]/60 backdrop-blur-xl shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tighter text-white">
          Request Clearance
        </CardTitle>
        <CardDescription className="text-slate-400">
          Create a new trader profile to join the network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister}>
          <div className="grid w-full items-center gap-4">
            {error && (
              <div className="p-3 text-sm text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="text-slate-200">Call Sign (Name)</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maverick" 
                className="bg-[#0F172A]/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-[#00FF9D]"
                required
              />
              {fieldErrors.name && <span className="text-xs text-[#FF3B30]">{fieldErrors.name[0]}</span>}
            </div>
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
              {fieldErrors.email && <span className="text-xs text-[#FF3B30]">{fieldErrors.email[0]}</span>}
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
              {fieldErrors.password && <span className="text-xs text-[#FF3B30]">{fieldErrors.password[0]}</span>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirm_password" className="text-slate-200">Confirm Key</Label>
              <Input 
                id="confirm_password" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-[#0F172A]/50 border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-[#00FF9D]"
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF9D] hover:bg-[#00cc7d] text-slate-900 font-bold shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all hover:shadow-[0_0_25px_rgba(0,255,157,0.6)] disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-xs text-slate-500">
          Already have clearance? <Link href="/auth/login" className="text-[#3B82F6] hover:underline">Initiate Session</Link>
        </div>
      </CardFooter>
    </Card>
  )
}
