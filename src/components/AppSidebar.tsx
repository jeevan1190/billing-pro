import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, History, FilePlus, FileText, CreditCard, Clock,
  BarChart3, ShoppingCart, ClipboardList, Users2, Package, Tags,
  IndianRupee, UserPlus, Settings, UserCircle, LogOut, Zap, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: { label: string; icon: React.ElementType; path: string }[];
}

// Per-section color config: gradient, badge color, icon accent
const sectionColors: Record<string, {
  gradient: string;
  badge: string;
  iconColor: string;
  activeGlow: string;
  activeBg: string;
  hoverBg: string;
}> = {
  'Main':         {
    gradient:   'from-cyan-500 to-blue-500',
    badge:      'bg-cyan-50 text-cyan-600 border-cyan-200',
    iconColor:  'text-cyan-500',
    activeGlow: 'shadow-[0_0_12px_hsl(190_80%_50%/0.2)]',
    activeBg:   'bg-cyan-50 border-l-2 border-cyan-500',
    hoverBg:    'hover:bg-cyan-50',
  },
  'Purchases':    {
    gradient:   'from-violet-500 to-purple-600',
    badge:      'bg-violet-50 text-violet-600 border-violet-200',
    iconColor:  'text-violet-500',
    activeGlow: 'shadow-[0_0_12px_hsl(265_70%_60%/0.2)]',
    activeBg:   'bg-violet-50 border-l-2 border-violet-500',
    hoverBg:    'hover:bg-violet-50',
  },
  'Sales Module': {
    gradient:   'from-emerald-400 to-green-500',
    badge:      'bg-emerald-50 text-emerald-600 border-emerald-200',
    iconColor:  'text-emerald-500',
    activeGlow: 'shadow-[0_0_12px_hsl(148_60%_45%/0.2)]',
    activeBg:   'bg-emerald-50 border-l-2 border-emerald-500',
    hoverBg:    'hover:bg-emerald-50',
  },
  'Bills Module': {
    gradient:   'from-pink-500 to-rose-600',
    badge:      'bg-pink-50 text-pink-600 border-pink-200',
    iconColor:  'text-pink-500',
    activeGlow: 'shadow-[0_0_12px_hsl(330_80%_60%/0.2)]',
    activeBg:   'bg-pink-50 border-l-2 border-pink-500',
    hoverBg:    'hover:bg-pink-50',
  },
  'Items Module': {
    gradient:   'from-orange-400 to-amber-500',
    badge:      'bg-orange-50 text-orange-600 border-orange-200',
    iconColor:  'text-orange-500',
    activeGlow: 'shadow-[0_0_12px_hsl(25_90%_55%/0.2)]',
    activeBg:   'bg-orange-50 border-l-2 border-orange-500',
    hoverBg:    'hover:bg-orange-50',
  },
  'System':       {
    gradient:   'from-red-400 to-pink-600',
    badge:      'bg-red-50 text-red-600 border-red-200',
    iconColor:  'text-red-500',
    activeGlow: 'shadow-[0_0_12px_hsl(0_80%_60%/0.2)]',
    activeBg:   'bg-red-50 border-l-2 border-red-500',
    hoverBg:    'hover:bg-red-50',
  },
};

const menu: { section: string; items: MenuItem[] }[] = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    section: 'Purchases',
    items: [
      { label: 'Purchase Entry',   icon: ShoppingCart,  path: '/purchase-entry' },
      { label: 'Purchase History', icon: ClipboardList, path: '/purchase-history' },
    ],
  },
  {
    section: 'Sales Module',
    items: [
      { label: 'Sales History', icon: BarChart3, path: '/sales-history' },
    ],
  },
  {
    section: 'Bills Module',
    items: [
      { label: 'Create Bill', icon: FilePlus,      path: '/create-bill' },
      { label: 'All Bills',   icon: FileText,      path: '/all-bills' },
      { label: 'Daily report', icon: ClipboardList, path: '/daily-report' },
    ],
  },
  {
    section: 'Items Module',
    items: [
      { label: 'Manage Items', icon: Package, path: '/items' },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'User Profile', icon: UserCircle, path: '/profile' },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside
      className="w-[258px] min-h-screen flex flex-col shrink-0 no-print relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #fff5f8 0%, #ffffff 40%, #f0fdf4 100%)',
        borderRight: '1px solid hsl(330 20% 90%)',
      }}
    >
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-24 -left-16 w-64 h-64 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(330 80% 88%) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 -right-20 w-48 h-48 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(270 70% 88%) 0%, transparent 70%)',
            animation: 'pulse 6s ease-in-out infinite 1s',
          }}
        />
        <div
          className="absolute -bottom-12 left-10 w-48 h-48 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(140 60% 85%) 0%, transparent 70%)',
            animation: 'pulse 5s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* ── Logo / Header ── */}
      <div
        className="relative h-16 flex items-center gap-3 px-5 shrink-0"
        style={{ borderBottom: '1px solid hsl(330 20% 90%)' }}
      >
        {/* Shimmer logo icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, hsl(330 80% 60%), hsl(270 70% 65%))',
            boxShadow: '0 4px 10px hsl(330 80% 60% / 0.3)',
          }}
        >
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <span
            className="font-extrabold text-base tracking-tight"
            style={{
              background: 'linear-gradient(90deg, hsl(330 80% 50%), hsl(270 70% 55%), hsl(140 60% 40%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PhotoBill Pro
          </span>
          <p className="text-[10px] leading-none mt-0.5 text-slate-500">
            Billing Manager
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="relative flex-1 overflow-y-auto py-4 px-3 space-y-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'hsl(330 20% 80%) transparent' }}
      >
        {menu.map((group, gi) => {
          const sc = sectionColors[group.section] ?? sectionColors['System'];
          return (
            <div key={group.section} style={{ animation: `slideIn 0.4s ease both ${gi * 60}ms` }}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(group.section)}
                className="flex items-center justify-between w-full px-2 mb-1.5 group"
              >
                <div className="flex items-center gap-2">
                  {/* Colored dot */}
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: `linear-gradient(135deg, ${sc.gradient.split(' ')[1]}, ${sc.gradient.split(' ')[3]})` }}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border',
                      sc.badge,
                    )}
                  >
                    {group.section}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'w-3 h-3 text-slate-400 transition-transform duration-300',
                    collapsed[group.section] && '-rotate-90',
                  )}
                />
              </button>

              {/* Menu items */}
              {!collapsed[group.section] && (
                <ul className="space-y-0.5">
                  {group.items.map((item, ii) => {
                    const active = location.pathname === item.path;
                    return (
                      <li key={item.label} style={{ animation: `slideIn 0.35s ease both ${ii * 40}ms` }}>
                        <button
                          onClick={() => item.path && navigate(item.path)}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
                            active
                              ? cn('font-semibold text-slate-900', sc.activeBg, sc.activeGlow)
                              : cn('text-slate-600 hover:text-slate-900', sc.hoverBg),
                          )}
                        >
                          {/* Icon wrapper */}
                          <span
                            className={cn(
                              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all',
                              active
                                ? 'bg-white shadow-sm'
                                : 'bg-slate-100/50 group-hover:bg-white group-hover:shadow-sm',
                            )}
                          >
                            <item.icon
                              className={cn('w-3.5 h-3.5', sc.iconColor)}
                            />
                          </span>
                          <span className="truncate">{item.label}</span>

                          {/* Active pill dot */}
                          {active && (
                            <span
                              className={cn("ml-auto w-1.5 h-1.5 rounded-full shrink-0", sc.iconColor.replace('text-', 'bg-'))}
                              style={{ boxShadow: '0 0 4px currentColor' }}
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── User / Logout ── */}
      <div
        className="relative p-3 shrink-0"
        style={{ borderTop: '1px solid hsl(330 20% 90%)' }}
      >
        {/* User card */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 bg-white/60 shadow-sm border border-slate-100 backdrop-blur-sm"
        >
          {/* Avatar with gradient ring */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{
              background: 'linear-gradient(135deg, hsl(330 80% 60%), hsl(270 70% 65%))',
              boxShadow: '0 4px 10px hsl(330 80% 60% / 0.3)',
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p
              className="text-[10px] font-medium"
              style={{
                background: 'linear-gradient(90deg, hsl(330 80% 50%), hsl(270 70% 55%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Administrator
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 group text-slate-600 hover:text-red-500 hover:bg-red-50"
        >
          <span className="w-7 h-7 rounded-lg bg-slate-100/50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
            <LogOut className="w-3.5 h-3.5 group-hover:text-red-500" />
          </span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
