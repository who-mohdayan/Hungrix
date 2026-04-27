import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiTrendingUp, FiUsers, FiBarChart2, FiBook, FiLogOut, FiCheckSquare,
} from 'react-icons/fi';

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/predictions', label: 'Predictions', icon: FiTrendingUp },
  { to: '/admin/attendance', label: 'Attendance', icon: FiCheckSquare },
  { to: '/admin/students', label: 'Students', icon: FiUsers },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/admin/menu', label: 'Menu', icon: FiBook },
];

export default function AdminTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex flex-col gap-3 px-5 py-3 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold text-slate-800">Hungrix</p>
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">Where Dining Meets Prediction</p>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <FiLogOut size={13} /> Logout
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-slate-500 leading-tight">Admin User</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
