import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiTrendingUp, FiUsers, FiBarChart2, FiBook, FiLogOut,
  FiChevronLeft, FiChevronRight, FiShield, FiCheckSquare
} from 'react-icons/fi';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/predictions', label: 'Predictions', icon: FiTrendingUp },
  { to: '/admin/attendance', label: 'Attendance', icon: FiCheckSquare },
  { to: '/admin/students', label: 'Students', icon: FiUsers },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/admin/menu', label: 'Menu', icon: FiBook },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside
      className={`relative text-white flex flex-col min-h-screen transition-all duration-300 border-r border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-green-950 ${collapsed ? 'w-16' : 'w-64'} shrink-0`}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700/80">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FiShield className="text-orange-300" size={18} />
            <div>
              <p className="text-sm font-semibold text-white">Hungrix</p>
              <p className="text-[11px] text-slate-300">Where Dining Meets Prediction</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-300 hover:text-white p-1.5 rounded-md transition-colors hover:bg-slate-800 ml-auto"
        >
          {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-4 border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-900/40">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-300">Administrator</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 py-4 px-2 space-y-1">
        {sidebarLinks.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            title={collapsed ? label : ''}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl
              ${location.pathname === to
                ? 'bg-green-800/90 text-white shadow-[inset_0_0_0_1px_rgba(134,239,172,0.3)]'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
          >
            {icon({ size: 18, className: 'shrink-0' })}
            {!collapsed && label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700/80">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : ''}
          className="flex items-center gap-3 w-full text-sm text-slate-200 hover:text-white hover:bg-slate-800 px-3 py-2.5 rounded-xl transition-colors"
        >
          <FiLogOut size={18} className="shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
