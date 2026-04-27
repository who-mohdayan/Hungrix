import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import StatCard from '../../components/StatCard';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { FiUsers, FiCalendar, FiAlertTriangle, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overviewStats, setOverviewStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [liveStats, setLiveStats] = useState(null);

  const getDateOffset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, analytics, realtime] = await Promise.all([
          api.getOverviewStats(),
          api.getAnalytics({ startDate: getDateOffset(-7), endDate: getDateOffset(0) }),
          api.getRealtimeAnalytics()
        ]);
        setOverviewStats(stats);
        setAnalyticsData(analytics.data || []);
        setLiveStats(realtime);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setAnalyticsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = analyticsData.slice(-7).map((d, idx) => ({
    day: `D${idx + 1}`,
    Bookings: d.bookings,
    Attendance: d.attendance,
  }));

  const todayMealBreakdown = useMemo(() => {
    const distribution = liveStats?.mealDistribution || {};
    return ['Breakfast', 'Lunch', 'Dinner'].map((meal) => ({
      meal,
      booked: distribution[meal]?.booked || 0,
      attended: distribution[meal]?.attended || 0,
      pending: distribution[meal]?.pending || 0,
    }));
  }, [liveStats]);

  const dashboardAlerts = useMemo(() => {
    const alerts = [];
    const pending = liveStats?.pendingToday || 0;
    const attendanceRate = overviewStats?.attendanceRate || 0;

    if (pending > 0) {
      alerts.push({ id: 'pending', type: 'warning', msg: `${pending} bookings are still pending attendance marking.` });
    }
    if (attendanceRate < 70) {
      alerts.push({ id: 'rate', type: 'warning', msg: `Attendance rate is ${attendanceRate}%. Consider follow-up with low-attendance students.` });
    }
    alerts.push({ id: 'prediction', type: 'info', msg: 'Check predictions daily to avoid over-preparation and food waste.' });

    return alerts;
  }, [liveStats, overviewStats]);

  if (loading) return <AdminLayout><div className="flex h-full min-h-[60vh] items-center justify-center"><LoadingSpinner /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-7">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-emerald-950 to-orange-950 p-6 text-white shadow-xl lg:p-8">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-emerald-400/15 blur-2xl" />
          <div className="absolute -bottom-16 left-20 h-44 w-44 rounded-full bg-orange-300/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-100/70">Operations Snapshot</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">Admin Command Center</h1>
              <p className="mt-2 text-sm text-slate-200">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="mt-3 max-w-xl text-sm text-slate-300">
                Monitor live meal activity, spot attendance risks early, and move quickly on pending check-ins.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Today</p>
                <p className="mt-1 text-2xl font-semibold">{liveStats?.totalToday || 0}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-orange-200">{liveStats?.pendingToday || 0}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 col-span-2 sm:col-span-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Attendance</p>
                <p className="mt-1 text-2xl font-semibold">{overviewStats?.attendanceRate || 0}%</p>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/admin/attendance"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Open Attendance Desk
            </Link>
            <span className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-100">
              Live feed active: {liveStats?.totalToday || 0} bookings tracked
            </span>
          </div>
        </section>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Bookings Today" value={liveStats?.totalToday || overviewStats?.todayBookings || 0} icon={FiCalendar} color="indigo" />
          <StatCard title="Pending Check-ins" value={liveStats?.pendingToday || 0} icon={FiTrendingUp} color="blue" subtitle="Needs admin action" />
          <StatCard title="Attendance Rate" value={`${overviewStats?.attendanceRate || 0}%`} icon={FiCheckCircle} color="emerald" />
          <StatCard title="Active Students" value={`${overviewStats?.activeStudents || 0}/${overviewStats?.totalStudents || 0}`} icon={FiUsers} color="amber" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Meal Attendance Overview</h2>
                <p className="text-xs text-slate-500">Booked vs attended vs pending for today</p>
              </div>
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                Live breakdown
              </span>
            </div>
            <ResponsiveContainer width="100%" height={245}>
              <BarChart data={todayMealBreakdown}>
                <XAxis dataKey="meal" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="booked" name="Booked" fill="#6c7a70" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attended" name="Attended" fill="#2f6f46" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#d67a2e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900">7-Day Momentum</h2>
              <p className="text-xs text-slate-500">Booking and attendance trajectory</p>
            </div>
            <ResponsiveContainer width="100%" height={245}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="Bookings" stroke="#6c7a70" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Attendance" stroke="#2f6f46" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
              <FiAlertTriangle className="text-amber-500" size={18} /> Operations Alerts
            </h2>
            <div className="space-y-3">
              {dashboardAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl border px-3 py-3 text-sm ${alert.type === 'warning'
                    ? 'border-amber-200 bg-amber-50 text-amber-900'
                    : alert.type === 'success'
                      ? 'border-green-200 bg-green-50 text-green-900'
                      : 'border-orange-200 bg-orange-50 text-orange-900'}`}
                >
                  <p className="font-medium">{alert.type === 'warning' ? 'Attention Required' : 'System Note'}</p>
                  <p className="mt-1">{alert.msg}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Booking Activity</h2>
            <div className="space-y-3">
              {(liveStats?.recentActivity || []).slice(0, 6).map((item, index) => (
                <div key={`${item.student}-${item.timestamp}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.student}</p>
                    <p className="text-xs text-slate-500">{item.meal} · {item.date}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Attended' ? 'bg-green-100 text-green-700' : item.status === 'Missed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
              {(!liveStats?.recentActivity || liveStats.recentActivity.length === 0) && (
                <p className="text-sm text-slate-500">No recent activity available yet.</p>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-orange-50 via-white to-emerald-50 p-6 shadow-sm">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Daily Priority</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {liveStats?.pendingToday || 0} pending check-ins are waiting for attendance confirmation.
              </p>
            </div>
            <Link
              to="/admin/attendance"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Review Now
            </Link>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
