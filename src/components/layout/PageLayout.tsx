import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Bug,
  LogOut,
  Menu,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiKeyProvider } from '../../context/ApiKeyContext';
import { cn } from '../../lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/bugs', label: 'Bugs', icon: Bug },
];

export default function PageLayout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('sidebar_collapsed') === 'true'
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar_collapsed', String(next));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <ApiKeyProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">

        {/* ── Desktop sidebar ── */}
        <aside
          className={cn(
            'hidden md:flex flex-col bg-white border-r border-gray-200 shrink-0 transition-all duration-200 overflow-hidden',
            collapsed ? 'w-16' : 'w-56'
          )}
        >
          {/* Brand */}
          <div
            className={cn(
              'flex items-center h-14 border-b border-gray-100 shrink-0',
              collapsed ? 'justify-center' : 'gap-2 px-5'
            )}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-gray-900 text-sm tracking-tight whitespace-nowrap">
                FeedBot
              </span>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-2 py-4 space-y-0.5">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-lg transition-colors',
                    collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Bottom: logout + collapse toggle */}
          <div className="px-2 py-3 border-t border-gray-100 space-y-0.5 shrink-0">
            <button
              onClick={handleLogout}
              title={collapsed ? 'Logout' : undefined}
              className={cn(
                'flex items-center w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors',
                collapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'
              )}
            >
              <LogOut size={18} className="shrink-0" />
              {!collapsed && 'Logout'}
            </button>

            <button
              onClick={toggleCollapsed}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'flex items-center w-full rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors',
                collapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
              )}
            >
              {collapsed ? (
                <ChevronRight size={15} />
              ) : (
                <>
                  <ChevronLeft size={15} />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* ── Mobile overlay sidebar ── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative z-50 flex flex-col w-56 h-full bg-white shadow-xl">
              <div className="flex items-center gap-2 px-5 h-14 border-b border-gray-100 shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-gray-900 text-sm tracking-tight">FeedBot</span>
              </div>

              <nav className="flex-1 px-2 py-4 space-y-0.5">
                {NAV.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="px-2 py-3 border-t border-gray-100 shrink-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ── Main content ── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile topbar */}
          <header className="md:hidden flex items-center justify-between px-4 bg-white border-b border-gray-200 h-14 shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 text-sm">FeedBot</span>
            </div>
            <div className="w-8" />
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>

      </div>
    </ApiKeyProvider>
  );
}
