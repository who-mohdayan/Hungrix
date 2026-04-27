import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated) {
    navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    } else {
      setError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#bbf7d0_0%,#ecfeff_45%,#f8fafc_100%)] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-12 h-64 w-64 rounded-full bg-cyan-200/70 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="grid w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 shadow-2xl backdrop-blur-xl lg:grid-cols-5">
          <section className="relative hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white lg:col-span-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Campus Dining</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">Hungrix</h1>
            <p className="mt-3 text-sm text-emerald-50/90">Where Dining Meets Prediction</p>

            <div className="mt-8 space-y-3 text-sm text-emerald-50/95">
              <p className="rounded-xl bg-white/15 px-3 py-2">Track your daily bookings and attendance in one place.</p>
              <p className="rounded-xl bg-white/15 px-3 py-2">Get meal updates and a cleaner dining routine.</p>
            </div>

            <div className="absolute bottom-6 right-6 text-6xl opacity-20">🍽️</div>
          </section>

          <section className="p-6 sm:p-8 lg:col-span-3 lg:p-10">
            <div className="mb-7 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Campus Dining</p>
              <h1 className="mt-2 text-2xl font-semibold text-emerald-800">Hungrix</h1>
              <p className="text-sm text-slate-500">Where Dining Meets Prediction</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Student Sign In</h2>
              <p className="mt-1 text-sm text-slate-500">Enter your credentials to access your meal dashboard.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="student@campus.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoadingSpinner size="sm" color="white" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-emerald-600 hover:underline">Register</Link>
            </div>

            <div className="mt-2 text-sm text-slate-500">
              Are you an admin?{' '}
              <Link to="/admin/login" className="font-semibold text-emerald-700 hover:underline">Admin Login</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
