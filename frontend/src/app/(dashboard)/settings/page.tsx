"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Zap, Save, Check, ChevronRight } from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    name: "Trader Pro",
    email: "trader@trades-x.com",
    phone: "+62 812 3456 7890",
    emailNotifications: true,
    pushNotifications: true,
    signalAlerts: true,
    priceAlerts: true,
    newsAlerts: false,
    defaultOrderType: "market",
    confirmOrders: true,
    autoStopLoss: true,
    stopLossPercent: 5,
    maxPositionSize: 20,
    dailyLossLimit: 10,
    marginWarning: 80,
    theme: "dark",
    compactMode: false,
    showPnL: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 pt-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">Settings</h2>
            <p className="text-slate-300 text-sm mt-1">Manage your account, preferences, and security</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 rounded-full px-6 transition-all hover:scale-105 active:scale-95">
          {saved ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <div className="flex-1 min-h-0">
          <Tabs defaultValue="profile" orientation="vertical" className="h-full flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-2 p-0 w-full">
                    {[
                        { value: "profile", icon: User, label: "Profile" },
                        { value: "notifications", icon: Bell, label: "Notifications" },
                        { value: "trading", icon: Zap, label: "Trading" },
                        { value: "security", icon: Shield, label: "Security" },
                    ].map((tab) => (
                        <TabsTrigger 
                            key={tab.value}
                            value={tab.value} 
                            className="w-full justify-between group px-4 py-3 rounded-xl border border-transparent data-[state=active]:bg-white/10 data-[state=active]:border-white/10 data-[state=active]:text-white text-slate-400 font-bold hover:bg-white/5 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </div>
                            <ChevronRight className="h-4 w-4 opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-0 h-full">
                    <div className="card-panel p-8 min-h-full">
                        <div className="max-w-3xl">
                            <div className="mb-8 border-b border-slate-100 pb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Profile Information</h3>
                                <p className="text-slate-500 mt-1">Manage your public profile and private details.</p>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="flex items-center gap-8">
                                    <div className="relative group cursor-pointer">
                                        <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                            <span className="text-4xl font-black text-white">TP</span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-bold uppercase">Change</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900">Trader Pro</h4>
                                        <p className="text-slate-500 text-sm mb-3">Member since 2024</p>
                                        <Badge className="bg-emerald-100 text-emerald-700 border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider">KYC Verified</Badge>
                                    </div>
                                </div>
                                
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-3">
                                        <Label className="text-slate-500 font-bold text-xs uppercase tracking-wider">Display Name</Label>
                                        <Input
                                            value={settings.name}
                                            onChange={(e) => setSettings({...settings, name: e.target.value})}
                                            className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500 font-medium text-lg"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-slate-500 font-bold text-xs uppercase tracking-wider">Email Address</Label>
                                        <Input
                                            value={settings.email}
                                            onChange={(e) => setSettings({...settings, email: e.target.value})}
                                            className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500 font-medium text-lg"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-slate-500 font-bold text-xs uppercase tracking-wider">Phone Number</Label>
                                        <Input
                                            value={settings.phone}
                                            onChange={(e) => setSettings({...settings, phone: e.target.value})}
                                            className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500 font-medium text-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="mt-0 h-full">
                    <div className="card-panel p-8 min-h-full">
                         <div className="max-w-3xl">
                            <div className="mb-8 border-b border-slate-100 pb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Notification Preferences</h3>
                                <p className="text-slate-500 mt-1">Control how and when you want to be notified.</p>
                            </div>

                            <div className="space-y-4">
                            {[
                                { key: "emailNotifications", label: "Email Notifications", desc: "Receive weekly summaries and major alerts" },
                                { key: "pushNotifications", label: "Push Notifications", desc: "Real-time browser notifications for fills and alerts" },
                                { key: "signalAlerts", label: "AI Signal Alerts", desc: "Get instantly notified when the AI detects a strong setup" },
                                { key: "priceAlerts", label: "Price Alerts", desc: "Notifications when your watched assets hit targets" },
                                { key: "newsAlerts", label: "News Alerts", desc: "Breaking news affecting your portfolio" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div>
                                        <div className="text-slate-900 font-bold text-lg">{item.label}</div>
                                        <div className="text-slate-500 text-sm">{item.desc}</div>
                                    </div>
                                    <Switch
                                        checked={settings[item.key as keyof typeof settings] as boolean}
                                        onCheckedChange={(checked) => setSettings({...settings, [item.key]: checked})}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Trading Tab */}
                <TabsContent value="trading" className="mt-0 h-full">
                    <div className="card-panel p-8 min-h-full">
                        <div className="max-w-3xl">
                            <div className="mb-8 border-b border-slate-100 pb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Trading Configuration</h3>
                                <p className="text-slate-500 mt-1">Customize your execution and risk management rules.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
                                        <div>
                                            <div className="text-slate-900 font-bold text-lg">Confirm Before Order</div>
                                            <div className="text-sm text-slate-500">Show a confirmation dialog before submitting any order</div>
                                        </div>
                                        <Switch
                                        checked={settings.confirmOrders}
                                        onCheckedChange={(checked) => setSettings({...settings, confirmOrders: checked})}
                                        className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200">
                                        <div>
                                            <div className="text-slate-900 font-bold text-lg">Auto Stop-Loss</div>
                                            <div className="text-sm text-slate-500">Automatically attach a stop-loss to market orders</div>
                                        </div>
                                        <Switch
                                        checked={settings.autoStopLoss}
                                        onCheckedChange={(checked) => setSettings({...settings, autoStopLoss: checked})}
                                        className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-slate-500 font-bold text-xs uppercase tracking-wider">Default Stop-Loss (%)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={settings.stopLossPercent}
                                                onChange={(e) => setSettings({...settings, stopLossPercent: parseInt(e.target.value)})}
                                                className="h-12 pl-4 pr-12 bg-white border-slate-200 text-slate-900 focus:ring-blue-500 font-mono font-bold text-lg"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-slate-500 font-bold text-xs uppercase tracking-wider">Max Position Size (%)</Label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                value={settings.maxPositionSize}
                                                onChange={(e) => setSettings({...settings, maxPositionSize: parseInt(e.target.value)})}
                                                className="h-12 pl-4 pr-12 bg-white border-slate-200 text-slate-900 focus:ring-blue-500 font-mono font-bold text-lg"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="mt-0 h-full">
                    <div className="card-panel p-8 min-h-full">
                        <div className="max-w-3xl">
                             <div className="mb-8 border-b border-slate-100 pb-6">
                                <h3 className="text-2xl font-bold text-slate-900">Security Settings</h3>
                                <p className="text-slate-500 mt-1">Protect your account and assets.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Shield className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-slate-900 font-bold text-lg">Two-Factor Authentication</div>
                                            <div className="text-sm text-slate-500 mt-1">Protect your account with Google Authenticator</div>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 border-0 px-3 py-1 font-bold">Enabled</Badge>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div>
                                            <div className="text-slate-900 font-bold">Session Timeout</div>
                                            <div className="text-sm text-slate-500">Auto-logout duration</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <span className="font-mono font-bold">30 minutes</span>
                                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div>
                                            <div className="text-slate-900 font-bold">Change Password</div>
                                            <div className="text-sm text-slate-500">Last changed 30 days ago</div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </div>
          </Tabs>
      </div>
    </div>
  )
}
