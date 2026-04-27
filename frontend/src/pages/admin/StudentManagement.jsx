import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  FiSearch, FiAlertTriangle, FiEye, FiUsers, FiTrendingUp,
  FiShield, FiX, FiChevronUp, FiChevronDown, FiUser,
} from 'react-icons/fi';

/* ── helpers ──────────────────────────────────────────────────── */
function initials(name = '') {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function scoreConfig(score) {
  if (score >= 80) return { label: 'Excellent', bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (score >= 60) return { label: 'Good', bar: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' };
  return { label: 'At Risk', bar: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' };
}

function ScoreBar({ score }) {
  const cfg = scoreConfig(score);
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${cfg.text}`}>{score}</span>
    </div>
  );
}

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field) return <FiChevronUp size={12} className="text-slate-300 ml-0.5" />;
  return sortDir === 'asc'
    ? <FiChevronUp size={12} className="text-emerald-500 ml-0.5" />
    : <FiChevronDown size={12} className="text-emerald-500 ml-0.5" />;
}

/* ── component ────────────────────────────────────────────────── */
export default function StudentManagement() {
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [hostelFilter, setHostelFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    api.getAllStudents()
      .then(data => setAllStudents(Array.isArray(data) ? data : []))
      .catch(err => console.error('Error fetching students:', err))
      .finally(() => setLoading(false));
  }, []);

  /* derived aggregates */
  const summary = useMemo(() => ({
    total: allStudents.length,
    flagged: allStudents.filter(s => s.accountabilityScore < 50).length,
    avgScore: allStudents.length
      ? Math.round(allStudents.reduce((a, s) => a + (s.accountabilityScore || 0), 0) / allStudents.length)
      : 0,
    avgAttendance: allStudents.length
      ? Math.round(allStudents.reduce((a, s) => a + (s.attendanceRate || 0), 0) / allStudents.length)
      : 0,
  }), [allStudents]);

  const hostels = useMemo(() => [...new Set(allStudents.map(s => s.hostel).filter(Boolean))].sort(), [allStudents]);

  /* filter + sort */
  const students = useMemo(() => {
    let list = [...allStudents];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
    }
    if (hostelFilter) list = list.filter(s => s.hostel === hostelFilter);
    if (scoreFilter === 'high') list = list.filter(s => s.accountabilityScore >= 80);
    else if (scoreFilter === 'medium') list = list.filter(s => s.accountabilityScore >= 60 && s.accountabilityScore < 80);
    else if (scoreFilter === 'low') list = list.filter(s => s.accountabilityScore < 60);

    list.sort((a, b) => {
      const key = sortBy === 'score' ? 'accountabilityScore' : sortBy === 'attendance' ? 'attendanceRate' : 'name';
      let vA = a[key]; let vB = b[key];
      if (typeof vA === 'string') { vA = vA.toLowerCase(); vB = vB.toLowerCase(); }
      return sortDir === 'asc' ? (vA > vB ? 1 : -1) : (vA < vB ? 1 : -1);
    });
    return list;
  }, [allStudents, search, hostelFilter, scoreFilter, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const clearFilters = () => { setSearch(''); setHostelFilter(''); setScoreFilter(''); };
  const hasFilters = search || hostelFilter || scoreFilter;

  if (loading) return (
    <AdminLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 px-6 py-8 text-white shadow-xl">
          {/* decorative rings */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/5" />

          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">Student Registry</h1>
          <p className="mt-1.5 max-w-lg text-sm text-slate-400">
            Monitor accountability scores, attendance rates, and flag at-risk students across all hostels.
          </p>

          {/* stat chips */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: <FiUsers size={13} />, label: 'Total Students', value: summary.total, color: 'bg-white/10' },
              { icon: <FiShield size={13} />, label: 'Avg Score', value: summary.avgScore, color: 'bg-emerald-500/20' },
              { icon: <FiTrendingUp size={13} />, label: 'Avg Attendance', value: `${summary.avgAttendance}%`, color: 'bg-sky-500/20' },
              { icon: <FiAlertTriangle size={13} />, label: 'Flagged', value: summary.flagged, color: 'bg-rose-500/20' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className={`flex items-center gap-2 rounded-full ${color} px-4 py-2 text-sm backdrop-blur-sm`}>
                <span className="text-white/70">{icon}</span>
                <span className="text-white/60">{label}:</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Filter Bar ────────────────────────────────────────── */}
        <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
          {/* search */}
          <div className="relative min-w-52 flex-1">
            <FiSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or email…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm placeholder-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* hostel */}
          <select
            value={hostelFilter}
            onChange={e => setHostelFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Hostels</option>
            {hostels.map(h => <option key={h} value={h}>Hostel {h}</option>)}
          </select>

          {/* score tier */}
          <select
            value={scoreFilter}
            onChange={e => setScoreFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Score Tiers</option>
            <option value="high">Excellent ≥ 80</option>
            <option value="medium">Good 60–79</option>
            <option value="low">At Risk &lt; 60</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <FiX size={13} /> Clear
            </button>
          )}

          <span className="ml-auto text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-700">{students.length}</span> of {summary.total}
          </span>
        </section>

        {/* ── Table ─────────────────────────────────────────────── */}
        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {[
                    { label: 'Student', field: 'name' },
                    { label: 'Email', field: null },
                    { label: 'Hostel / Room', field: null },
                    { label: 'Score', field: 'score' },
                    { label: 'Attendance', field: 'attendance' },
                    { label: 'Bookings', field: null },
                    { label: 'Action', field: null },
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      onClick={() => field && toggleSort(field)}
                      className={`px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-500 ${field ? 'cursor-pointer select-none hover:text-emerald-600' : ''}`}
                    >
                      <span className="inline-flex items-center">
                        {label}
                        {field && <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-sm text-slate-400">
                      No students match the current filters.
                    </td>
                  </tr>
                )}
                {students.map(s => {
                  const cfg = scoreConfig(s.accountabilityScore);
                  const isFlagged = s.accountabilityScore < 50;
                  return (
                    <tr
                      key={s._id}
                      className={`group transition-colors ${isFlagged ? 'bg-rose-50/60' : 'hover:bg-slate-50/60'}`}
                    >
                      {/* student */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                            {initials(s.name)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">
                              {isFlagged && <FiAlertTriangle className="mr-1 inline text-rose-400" size={12} />}
                              {s.name}
                            </p>
                            {isFlagged && (
                              <span className="mt-0.5 inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                                At Risk
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* email */}
                      <td className="px-5 py-3.5 text-slate-500">{s.email}</td>

                      {/* hostel / room */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">H-{s.hostel}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-xs text-slate-600">{s.room}</span>
                        </div>
                      </td>

                      {/* score */}
                      <td className="px-5 py-3.5">
                        <ScoreBar score={s.accountabilityScore} />
                      </td>

                      {/* attendance */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} border`}>
                          {s.attendanceRate}%
                        </span>
                      </td>

                      {/* bookings */}
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{s.totalBookings}</td>

                      {/* action */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setSelectedStudent(s)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
                        >
                          <FiEye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Footer note ───────────────────────────────────────── */}
        <section className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <FiShield className="mt-0.5 shrink-0 text-slate-400" size={15} />
          <p className="text-xs text-slate-500">
            Accountability scores and attendance rates are calculated automatically from booking and attendance records.
            Students with a score below 50 are flagged for review.
          </p>
        </section>
      </div>

      {/* ── Student Detail Modal ───────────────────────────────── */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile"
      >
        {selectedStudent && (() => {
          const cfg = scoreConfig(selectedStudent.accountabilityScore);
          const isFlagged = selectedStudent.accountabilityScore < 50;
          return (
            <div className="space-y-5">
              {/* avatar + identity */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${cfg.bg} ${cfg.text}`}>
                  {initials(selectedStudent.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-slate-800">{selectedStudent.name}</p>
                  <p className="truncate text-sm text-slate-500">{selectedStudent.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                      Hostel {selectedStudent.hostel}
                    </span>
                    <span className="text-xs text-slate-400">Room {selectedStudent.room}</span>
                  </div>
                </div>
              </div>

              {/* score bar */}
              <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Accountability Score</p>
                  <span className={`text-xl font-bold ${cfg.text}`}>{selectedStudent.accountabilityScore}</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/60 overflow-hidden">
                  <div className={`h-full rounded-full ${cfg.bar} transition-all`} style={{ width: `${Math.min(selectedStudent.accountabilityScore, 100)}%` }} />
                </div>
                <p className={`mt-1.5 text-xs font-semibold ${cfg.text}`}>{cfg.label}</p>
              </div>

              {/* stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <FiTrendingUp size={16} />, label: 'Attendance', value: `${selectedStudent.attendanceRate}%`, color: 'text-sky-600' },
                  { icon: <FiUser size={16} />, label: 'Bookings', value: selectedStudent.totalBookings, color: 'text-slate-700' },
                  { icon: <FiShield size={16} />, label: 'Status', value: isFlagged ? 'Flagged' : 'Good', color: isFlagged ? 'text-rose-600' : 'text-emerald-600' },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                    <div className={`mx-auto mb-1 w-fit ${color}`}>{icon}</div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
                    <p className={`mt-0.5 text-base font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* flagged warning */}
              {isFlagged && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
                  <FiAlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <p>This student has a critically low accountability score. Consider issuing a warning or reviewing their booking history.</p>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </AdminLayout>
  );
}
