import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiMail, FiLock, FiShield, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated && isAdmin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success && result.isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.message || 'Invalid admin credentials.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_15%,#14532d_0%,#0f172a_38%,#020617_100%)] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-xl lg:grid-cols-5">
          <section className="hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-10 text-white lg:col-span-2 lg:block">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
              <FiShield size={28} />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Secure Access</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">Admin Control</h1>
            <p className="mt-3 text-sm text-emerald-50/90">Manage student dining intelligence with elevated privileges.</p>

            <div className="mt-8 space-y-3 text-sm text-white/90">
              <div className="flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={14} />
                Access analytics, attendance, menus, and prediction workflows.
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={14} />
                Keep operations accurate with centralized administration.
              </div>
            </div>

            <p className="mt-10 text-sm tracking-wide text-emerald-100/90 font-semibold">Hungrix Admin Portal</p>
          </section>

          <section className="p-6 sm:p-8 lg:col-span-3 lg:p-10">
            <div className="mb-7 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Secure Access</p>
              <h1 className="mt-2 text-3xl font-black text-white">Admin Control</h1>
              <p className="text-sm text-slate-400">Hungrix admin authentication</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Administrator Sign In</h2>
              <p className="mt-1 text-sm text-slate-400">Use your admin credentials to continue.</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Admin Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="admin@campus.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-300"
                  >
                    {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoadingSpinner size="sm" color="white" /> : 'Sign In as Admin'}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-800 pt-6">
              <p className="mb-3 text-sm text-slate-400">First time as admin?</p>
              <Link
                to="/admin/register"
                className="inline-flex rounded-xl bg-slate-800 px-5 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-slate-700 hover:text-emerald-200"
              >
                Create Admin Account
              </Link>
            </div>

            <div className="mt-4 text-sm text-slate-500">
              Student portal?{' '}
              <Link to="/login" className="font-semibold text-emerald-400 hover:underline">Student Login</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
