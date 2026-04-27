import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiCalendar, FiClock, FiUser, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/book-meal', label: 'Book Meal', icon: FiCalendar },
  { to: '/booking-history', label: 'History', icon: FiClock },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

export default function StudentNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="sticky top-0 z-50 border-b border-green-900/20 bg-white/85 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <div>
              <p className="text-slate-900 text-base font-semibold leading-tight">Hungrix</p>
              <p className="hidden lg:block text-[11px] text-slate-500 leading-tight">Where Dining Meets Prediction</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${location.pathname === to
                    ? 'bg-green-700 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-orange-50 hover:text-green-800'}`}
              >
                {icon({ size: 16 })}
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                {initials}
              </div>
              <span className="text-slate-700 text-sm">{user?.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-orange-50 hover:text-red-600 transition-colors"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-700 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pb-4">
          {navLinks.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium my-1 transition-colors
                ${location.pathname === to
                  ? 'bg-green-700 text-white'
                  : 'text-slate-600 hover:bg-orange-50 hover:text-green-800'}`}
            >
              {icon({ size: 16 })}
              {label}
            </Link>
          ))}
          <div className="border-t border-slate-200 mt-2 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                {initials}
              </div>
              <span className="text-slate-700 text-sm">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-red-600"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
