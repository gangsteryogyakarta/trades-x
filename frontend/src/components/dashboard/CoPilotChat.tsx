"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function CoPilotChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Trading Co-Pilot. I can help you analyze markets, suggest strategies, or explain complex trading concepts. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await api.coPilotChat(input)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col pt-8">
       {/* Header */}
       <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white uppercase drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">AI Co-Pilot</h2>
            <p className="text-slate-300 text-sm mt-1">Advanced market reasoning & strategy generation</p>
        </div>
        <div className="text-sm text-slate-400 font-mono border border-white/10 px-4 py-2 rounded-full bg-black/40 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-white font-bold">GPT-4 TURBO</span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 card-panel relative flex flex-col">
          <div className="card-header-pill shadow-purple-500/20 from-purple-600 to-purple-800 text-white">Live Session</div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 pt-12" ref={scrollRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
                  m.role === "assistant" 
                    ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white" 
                    : "bg-slate-900 text-white"
                }`}>
                  {m.role === "assistant" ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
                  m.role === "assistant"
                    ? "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"
                    : "bg-slate-900 text-white rounded-tr-none"
                }`}>
                  <p className="leading-relaxed text-sm">{m.content}</p>
                  <span className={`text-[10px] mt-2 block opacity-50 ${
                      m.role === "assistant" ? "text-slate-500" : "text-slate-300"
                  }`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start gap-4">
                 <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                 </div>
                 <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none px-6 py-4">
                    <div className="flex gap-1">
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
                <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about market trends, specific tickers, or strategy advice..."
                disabled={loading}
                className="pr-12 py-6 bg-slate-50 border-slate-200 focus:ring-purple-500 rounded-xl text-slate-900 placeholder:text-slate-400 shadow-inner"
                />
                <Button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg h-9 w-9 p-0 shadow-lg shadow-purple-200"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
            <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">AI can make mistakes. Consider checking important information.</p>
            </div>
          </div>
      </div>
    </div>
  )
}
