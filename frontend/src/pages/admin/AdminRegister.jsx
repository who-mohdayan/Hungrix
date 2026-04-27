import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUser, FiMail, FiLock, FiKey, FiArrowLeft, FiEye, FiEyeOff, FiCheckCircle, FiShield } from 'react-icons/fi';

export default function AdminRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    adminKey: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const departments = ['Operations', 'Finance', 'Kitchen', 'Nutrition', 'Quality Control', 'Management'];

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Valid email address required';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(form.password)) e.password = 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(form.password)) e.password = 'Password must contain at least one number';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.adminKey.trim()) e.adminKey = 'Admin registration key is required';
    if (!form.department) e.department = 'Please select a department';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'admin',
        adminKey: form.adminKey,
        department: form.department
      });
      setLoading(false);
      
      if (result.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrors({ submit: result.message || 'Registration failed' });
      }
    } catch (error) {
      setLoading(false);
      setErrors({ submit: 'An error occurred during registration' });
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Privileged Setup</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">Admin Registration</h1>
            <p className="mt-3 text-sm text-emerald-50/90">Create secure administrator access for dining operations.</p>

            <div className="mt-8 space-y-3 text-sm text-white/90">
              <div className="flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={14} />
                Department-tagged admin accounts for cleaner accountability.
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2">
                <FiCheckCircle className="mt-0.5 shrink-0" size={14} />
                Registration protected using your secure admin key.
              </div>
            </div>

            <p className="mt-10 text-xs tracking-wide text-emerald-100/90">DINORIX ADMIN PORTAL</p>
          </section>

          <section className="p-6 sm:p-8 lg:col-span-3 lg:p-10">
            <Link
              to="/admin/login"
              className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
            >
              <FiArrowLeft size={15} />
              Back to Admin Login
            </Link>

            <div className="mb-6 lg:hidden">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Privileged Setup</p>
              <h1 className="mt-2 text-3xl font-black text-white">Admin Registration</h1>
              <p className="text-sm text-slate-400">Create secure administrator access for dining operations.</p>
            </div>

            <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Use the registration key provided by the system administrator.
            </div>

            {errors.submit && (
              <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="John Kumar"
                    className={`w-full rounded-xl border bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      errors.name ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Admin Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="admin@campus.com"
                    className={`w-full rounded-xl border bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      errors.email ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-rose-300">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Department</label>
                <select
                  value={form.department}
                  onChange={handleChange('department')}
                  className={`w-full rounded-xl border bg-slate-800/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.department ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                  }`}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="mt-1 text-xs text-rose-300">{errors.department}</p>}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-500" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange('password')}
                      placeholder="Min 8 chars"
                      className={`w-full rounded-xl border bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        errors.password ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-300"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-rose-300">{errors.password}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-3 text-slate-500" size={16} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      placeholder="Repeat password"
                      className={`w-full rounded-xl border bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        errors.confirmPassword ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-300"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-rose-300">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Admin Registration Key</label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-3 text-slate-500" size={16} />
                  <input
                    type={showAdminKey ? 'text' : 'password'}
                    value={form.adminKey}
                    onChange={handleChange('adminKey')}
                    placeholder="Enter secure admin key"
                    className={`w-full rounded-xl border bg-slate-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      errors.adminKey ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminKey(!showAdminKey)}
                    className="absolute right-3 top-3 text-slate-500 transition hover:text-slate-300"
                  >
                    {showAdminKey ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.adminKey && <p className="mt-1 text-xs text-rose-300">{errors.adminKey}</p>}
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Password Rules</p>
                <div className="space-y-1 text-xs text-slate-400">
                  <p className={form.password.length >= 8 ? 'text-emerald-300' : ''}>{form.password.length >= 8 ? '✓' : '○'} At least 8 characters</p>
                  <p className={/[A-Z]/.test(form.password) ? 'text-emerald-300' : ''}>{/[A-Z]/.test(form.password) ? '✓' : '○'} One uppercase letter</p>
                  <p className={/[0-9]/.test(form.password) ? 'text-emerald-300' : ''}>{/[0-9]/.test(form.password) ? '✓' : '○'} One number</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <LoadingSpinner size="sm" color="white" /> : 'Create Admin Account'}
              </button>
            </form>

            <div className="mt-4 text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/admin/login" className="font-semibold text-emerald-400 hover:underline">Sign In</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
