import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full bg-reference text-slate-200 font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 relative">
             {/* Global Grid Overlay for Texture */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none fixed" />
             <div className="relative z-10 max-w-[1920px] mx-auto w-full">
                {children}
             </div>
        </main>
      </div>
    </div>
  )
}
