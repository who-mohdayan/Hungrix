import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUser, FiMail, FiLock, FiHome, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

const hostels = ['A', 'B', 'C', 'D', 'E'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', hostel: '', room: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.hostel) e.hostel = 'Select a hostel';
    if (!form.room.trim()) e.room = 'Room number required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const result = await register({ 
      name: form.name, 
      email: form.email, 
      password: form.password, 
      hostel: form.hostel, 
      room: form.room 
    });
    setLoading(false);
    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({ email: result.message || 'Registration failed' });
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_20%,#bbf7d0_0%,#ecfeff_42%,#f8fafc_100%)] p-4 sm:p-6">
      <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-12 h-64 w-64 rounded-full bg-cyan-200/70 blur-3xl" />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="grid w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white/80 shadow-2xl backdrop-blur-xl lg:grid-cols-5">
          <section className="relative hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-800 p-8 text-white lg:col-span-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Student Onboarding</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">Hungrix</h1>
            <p className="mt-3 text-sm text-emerald-50/90">Set up your dining account in under a minute.</p>

            <div className="mt-8 space-y-3 text-sm text-emerald-50/95">
              <p className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2">
                <FiCheckCircle size={14} />
                One profile for bookings, attendance, and meal tracking.
              </p>
              <p className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2">
                <FiCheckCircle size={14} />
                Personalized insights based on your dining pattern.
              </p>
            </div>

            <div className="absolute bottom-6 right-6 text-6xl opacity-20">🍽️</div>
          </section>

          <section className="p-6 sm:p-8 lg:col-span-3 lg:p-10">
            <div className="mb-7 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Student Onboarding</p>
              <h1 className="mt-2 text-2xl font-semibold text-emerald-800">Hungrix</h1>
              <p className="text-sm text-slate-500">Set up your dining account in under a minute.</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Create Student Account</h2>
              <p className="mt-1 text-sm text-slate-500">Fill in your details to start booking meals.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Aarav Sharma"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@campus.com"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hostel</label>
                  <div className="relative">
                    <FiHome className="absolute left-3 top-3 text-slate-400" size={16} />
                    <select
                      value={form.hostel}
                      onChange={set('hostel')}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="">Select hostel</option>
                      {hostels.map(h => <option key={h} value={h}>Hostel {h}</option>)}
                    </select>
                  </div>
                  {errors.hostel && <p className="mt-1 text-xs text-rose-600">{errors.hostel}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Room Number</label>
                  <input
                    type="text"
                    value={form.room}
                    onChange={set('room')}
                    placeholder="101"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  {errors.room && <p className="mt-1 text-xs text-rose-600">{errors.room}</p>}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      placeholder="Min. 6 characters"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 transition hover:text-slate-600"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={set('confirmPassword')}
                      placeholder="Repeat password"
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 transition hover:text-slate-600"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoadingSpinner size="sm" color="white" /> : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-emerald-600 hover:underline">Sign In</Link>
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
