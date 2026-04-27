import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import {
  FiCalendar, FiTrendingUp, FiTrendingDown, FiRefreshCw,
  FiActivity, FiBarChart2, FiDroplet, FiZap,
} from 'react-icons/fi';

/* ── small helpers ──────────────────────────────────────────── */
function TrendChip({ change, label, goodDirection = 'up' }) {
  const num = parseFloat(change);
  const isGood = goodDirection === 'up' ? num > 0 : num < 0;
  const colorClass = isGood ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50';
  const Icon = num > 0 ? FiTrendingUp : FiTrendingDown;
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-[11px] uppercase tracking-widest text-slate-400">{label}</p>
      <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${colorClass}`}>
        <Icon size={14} />
        {num > 0 ? '+' : ''}{change}%
      </div>
      <p className="mt-2 text-xs text-slate-400">vs previous period</p>
    </div>
  );
}

const MEAL_COLORS = { Breakfast: '#f97316', Lunch: '#10b981', Dinner: '#6366f1' };

export default function AnalyticsDashboard() {
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({ data: [], trends: {}, summary: {} });
  const [sustainabilityMetrics, setSustainabilityMetrics] = useState({});
  const [mealPopularity, setMealPopularity] = useState({ mealTypePopularity: [], topItems: [] });
  const [realtimeData, setRealtimeData] = useState({});
  const [heatmapData, setHeatmapData] = useState([]);
  const [comparative, setComparative] = useState({});
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchData();
    let interval;
    if (autoRefresh) interval = setInterval(() => fetchData(true), 2 * 60 * 1000);
    return () => { if (interval) clearInterval(interval); };
  }, [range, autoRefresh]);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const offset = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
      };
      const [analytics, sustainability, popularity, realtime, heatmap, comp] = await Promise.all([
        api.getAnalytics({ startDate: offset(-range), endDate: offset(0) }),
        api.getSustainabilityMetrics(),
        api.getMealPopularity(range),
        api.getRealtimeAnalytics(),
        api.getBookingHeatmap(range),
        api.getComparativeAnalysis(range),
      ]);
      setAnalyticsData(analytics);
      setSustainabilityMetrics(sustainability);
      setMealPopularity(popularity);
      setRealtimeData(realtime);
      setHeatmapData(heatmap);
      setComparative(comp);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex min-h-[60vh] items-center justify-center"><LoadingSpinner /></div>
    </AdminLayout>
  );

  const { data = [], trends = {}, summary = {} } = analyticsData;
  const sm = sustainabilityMetrics;

  const chartData = data.map((d, idx) => ({
    day: idx + 1,
    date: d.date?.slice(5) ?? `D${idx + 1}`,
    Bookings: d.bookings,
    Attendance: d.attendance,
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 px-6 py-8 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/5" />

          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">Analytics Dashboard</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Last refreshed at {lastUpdated.toLocaleTimeString()}
          </p>

          {/* controls */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setAutoRefresh(r => !r)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                autoRefresh ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <FiRefreshCw size={13} className={autoRefresh ? 'animate-spin' : ''} />
              {autoRefresh ? 'Live (2 min)' : 'Auto-refresh off'}
            </button>

            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/80">
              <FiCalendar size={13} />
              <select
                value={range}
                onChange={e => setRange(Number(e.target.value))}
                className="bg-transparent text-xs text-white focus:outline-none"
              >
                <option value={7} className="text-slate-800">Last 7 Days</option>
                <option value={14} className="text-slate-800">Last 14 Days</option>
                <option value={30} className="text-slate-800">Last 30 Days</option>
                <option value={60} className="text-slate-800">Last 60 Days</option>
              </select>
            </div>

            {/* live today chips */}
            {realtimeData.totalToday != null && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Today: <span className="font-bold">{realtimeData.totalToday} booked</span>
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  {realtimeData.attendedToday} attended
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300">
                  {realtimeData.pendingToday} pending
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ── Trend KPIs (merged with comparative) ──────────────── */}
        {(trends.bookings || trends.attendance || trends.waste) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trends.bookings && (
              <TrendChip change={trends.bookings.change} label="Booking Trend" goodDirection="up" />
            )}
            {trends.attendance && (
              <TrendChip change={trends.attendance.change} label="Attendance Trend" goodDirection="up" />
            )}
            {trends.waste && (
              <TrendChip change={trends.waste.change} label="Waste Trend" goodDirection="down" />
            )}
          </div>
        )}

        {/* ── Sustainability — single unified section ────────────── */}
        {sm && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-500">
              Sustainability Impact
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <span className="text-lg">🌱</span>, label: 'CO₂ Saved', value: `${sm.co2Saved ?? '—'} kg`, bar: 'bg-emerald-400', accent: 'text-emerald-700' },
                { icon: <FiDroplet size={18} className="text-sky-500" />, label: 'Water Saved', value: `${sm.waterSaved ?? '—'} L`, bar: 'bg-sky-400', accent: 'text-sky-700' },
                { icon: <span className="text-lg">♻️</span>, label: 'Food Waste Reduced', value: `${sm.foodWasteReduced ?? '—'} kg`, bar: 'bg-amber-400', accent: 'text-amber-700' },
                { icon: <FiZap size={18} className="text-violet-500" />, label: 'Energy Saved', value: `${sm.energySaved ?? '—'} kWh`, bar: 'bg-violet-400', accent: 'text-violet-700' },
                { icon: <span className="text-lg">💰</span>, label: 'Cost Savings', value: `₹${sm.costSavings != null ? (sm.costSavings / 1000).toFixed(1) : '—'}K`, bar: 'bg-rose-400', accent: 'text-rose-700' },
                { icon: <span className="text-lg">🍱</span>, label: 'Meals Served', value: sm.mealsSaved?.toLocaleString() ?? '—', bar: 'bg-orange-400', accent: 'text-orange-700' },
                { icon: <span className="text-lg">🌳</span>, label: 'Trees Equivalent', value: sm.treesEquivalent ?? '—', bar: 'bg-lime-500', accent: 'text-lime-700' },
                { icon: <FiActivity size={18} className="text-teal-500" />, label: 'Waste Reduction', value: `${sm.wasteReductionPercent ?? '—'}%`, bar: 'bg-teal-400', accent: 'text-teal-700' },
              ].map(({ icon, label, value, bar, accent }) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="mt-0.5 shrink-0">{icon}</div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 truncate">{label}</p>
                    <p className={`mt-0.5 text-lg font-bold leading-tight ${accent}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Chart 1: Bookings vs Attendance ───────────────────── */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h2 className="font-semibold text-slate-800">Bookings vs Attendance</h2>
              {summary.avgAttendanceRate && (
                <p className="text-xs text-slate-400 mt-0.5">Avg attendance rate: {summary.avgAttendanceRate}%</p>
              )}
            </div>
            <FiBarChart2 size={16} className="text-slate-300 mt-1" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={Math.max(1, Math.floor(data.length / 8))} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Bookings" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Attendance" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* ── Chart 2: Meal Distribution ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Meal Distribution */}
          <section className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">Meal Type Distribution</h2>
            {mealPopularity.mealTypePopularity?.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={mealPopularity.mealTypePopularity}
                      dataKey="value"
                      cx="50%" cy="50%"
                      innerRadius={45} outerRadius={74}
                      paddingAngle={4}
                    >
                      {mealPopularity.mealTypePopularity.map((entry, i) => (
                        <Cell key={i} fill={MEAL_COLORS[entry.name] ?? entry.color ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {mealPopularity.mealTypePopularity.map(({ name, value, count, attendanceRate }) => (
                    <div key={name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: MEAL_COLORS[name] ?? '#94a3b8' }} />
                      <span className="flex-1 text-slate-700">{name}</span>
                      <span className="font-semibold text-slate-800">{value}%</span>
                      {attendanceRate && (
                        <span className="text-xs text-slate-400">{attendanceRate}% att.</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 mt-6 text-center">No meal data available.</p>
            )}
          </section>
        </div>

        {/* ── Chart 4: Day-of-Week Heatmap ──────────────────────── */}
        {heatmapData.length > 0 && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">Bookings by Day of Week</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={heatmapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Breakfast" fill={MEAL_COLORS.Breakfast} stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Lunch" fill={MEAL_COLORS.Lunch} stackId="a" />
                <Bar dataKey="Dinner" fill={MEAL_COLORS.Dinner} stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* ── Comparative summary row ────────────────────────────── */}
        {comparative.current && (
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">
              Period Comparison
              <span className="ml-2 text-xs font-normal text-slate-400">({comparative.period})</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Bookings', current: comparative.current.totalBookings, change: comparative.changes?.totalBookings },
                { label: 'Attended', current: comparative.current.attended, change: comparative.changes?.attended },
                { label: 'Missed', current: comparative.current.missed, change: comparative.changes?.missed },
                { label: 'Attendance Rate', current: `${comparative.current.attendanceRate}%`, change: comparative.changes?.attendanceRate },
              ].map(({ label, current, change }) => {
                const num = parseFloat(change);
                const color = num > 0 ? 'text-emerald-600' : num < 0 ? 'text-rose-600' : 'text-slate-400';
                return (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-800">{current}</p>
                    {change != null && (
                      <p className={`mt-1 text-xs font-semibold ${color}`}>
                        {num > 0 ? '+' : ''}{change}% vs prev
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </AdminLayout>
  );
}
