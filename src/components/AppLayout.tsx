import AppSidebar from './AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] relative overflow-hidden">
      {/* Premium subtle background glow for the main app area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-100/50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-emerald-50/60 rounded-full blur-3xl opacity-60 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-purple-50/50 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <AppSidebar />
      <main className="flex-1 overflow-auto relative z-10">
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
