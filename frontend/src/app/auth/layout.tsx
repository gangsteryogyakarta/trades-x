export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center relative overflow-hidden">
      {/* Background Gradients/Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#00FF9D]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[100px]" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md p-4">
        {children}
      </div>
    </div>
  )
}
