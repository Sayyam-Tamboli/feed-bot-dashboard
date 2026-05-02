import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Bug,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiKeyProvider } from '../../context/ApiKeyContext';
import { cn } from '../../lib/utils';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/bugs', label: 'Bugs', icon: Bug },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 text-sm tracking-tight">FeedBot</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNav}
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

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ApiKeyProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 flex flex-col w-56 h-full bg-white shadow-xl">
              <SidebarContent onNav={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile topbar */}
          <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-bold text-gray-900 text-sm">FeedBot Dashboard</span>
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
