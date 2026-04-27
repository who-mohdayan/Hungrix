import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Modal from '../../components/Modal';
import { useMenu } from '../../context/MenuContext';
import {
  FiEdit2, FiPlus, FiCalendar, FiClock, FiEye, FiEyeOff, FiList,
} from 'react-icons/fi';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
const mealTimings = { Breakfast: '7:30 AM – 9:30 AM', Lunch: '12:00 PM – 2:00 PM', Dinner: '7:00 PM – 9:00 PM' };
const mealConfig = {
  Breakfast: { emoji: '🌅', color: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  Lunch:     { emoji: '☀️', color: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  Dinner:    { emoji: '🌙', color: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' },
};

function getWeekDates() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      short: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    };
  });
}

export default function MenuManagement() {
  const { addMenu, updateMenu, getMenuByDate } = useMenu();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ date: '', mealType: 'Lunch', items: '', timing: '' });
  const [studentView, setStudentView] = useState(false);
  const [saving, setSaving] = useState(false);

  const weekDates = getWeekDates();

  /* count of menus set this week */
  const totalSet = weekDates.reduce((acc, { date }) => acc + getMenuByDate(date).length, 0);
  const totalSlots = weekDates.length * mealTypes.length;

  const openAdd = (date, mealType) => {
    setEditing(null);
    setForm({ date, mealType, items: '', timing: mealTimings[mealType] });
    setModalOpen(true);
  };

  const openEdit = (menu) => {
    setEditing(menu);
    setForm({ date: menu.date, mealType: menu.mealType, items: menu.items.join(', '), timing: menu.timing });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const items = form.items.split(',').map(i => i.trim()).filter(Boolean);
    setSaving(true);
    try {
      if (editing) await updateMenu(editing._id, { ...form, items });
      else await addMenu({ ...form, items });
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 px-6 py-8 text-white shadow-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/5" />

          <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">Menu Planner</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Plan and manage the 7-day meal menu for all hostels.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs">
              <FiCalendar size={13} className="text-white/60" />
              <span className="text-white/60">This week:</span>
              <span className="font-bold">{totalSet} / {totalSlots} slots set</span>
            </div>
            {mealTypes.map(m => {
              const count = weekDates.filter(({ date }) => getMenuByDate(date).find(x => x.mealType === m)).length;
              return (
                <div key={m} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs">
                  <span>{mealConfig[m].emoji}</span>
                  <span className="text-white/60">{m}:</span>
                  <span className="font-semibold">{count}/7</span>
                </div>
              );
            })}
            <button
              onClick={() => setStudentView(v => !v)}
              className={`ml-auto flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                studentView ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {studentView ? <FiEyeOff size={13} /> : <FiEye size={13} />}
              {studentView ? 'Exit Preview' : 'Student Preview'}
            </button>
          </div>
        </section>

        {studentView ? (
          /* ── Student Preview ────────────────────────────────── */
          <div className="space-y-4">
            {weekDates.map(({ date, label }) => {
              const dayMenus = getMenuByDate(date);
              return (
                <section key={date} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                    <FiCalendar size={14} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">{label}</span>
                    <span className="text-xs text-slate-400">({date})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                    {mealTypes.map(mealType => {
                      const menu = dayMenus.find(m => m.mealType === mealType);
                      const cfg = mealConfig[mealType];
                      return (
                        <div key={mealType} className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-base ${cfg.color}`}>
                              {cfg.emoji}
                            </span>
                            <div>
                              <p className={`text-xs font-bold uppercase tracking-wide ${cfg.badge.split(' ')[1]}`}>{mealType}</p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                <FiClock size={9} />{mealTimings[mealType]}
                              </p>
                            </div>
                          </div>
                          {menu ? (
                            <ul className="space-y-1.5">
                              {menu.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-slate-400 italic">Menu not planned yet</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* ── Admin Edit View ────────────────────────────────── */
          <div className="space-y-6">
            {/* Weekly calendar grid */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
                <FiCalendar size={14} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">7-Day Planner</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="w-28 px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        Meal
                      </th>
                      {weekDates.map(({ date, label, short }) => (
                        <th key={date} className="min-w-36 px-4 py-3.5 text-left">
                          <p className={`text-xs font-bold ${label === 'Today' ? 'text-emerald-600' : 'text-slate-700'}`}>
                            {label}
                          </p>
                          <p className="text-[10px] text-slate-400">{date}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mealTypes.map(mealType => {
                      const cfg = mealConfig[mealType];
                      return (
                        <tr key={mealType} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
                              {cfg.emoji} {mealType}
                            </span>
                          </td>
                          {weekDates.map(({ date }) => {
                            const menu = getMenuByDate(date).find(m => m.mealType === mealType);
                            return (
                              <td key={date} className="px-4 py-4">
                                {menu ? (
                                  <div className="space-y-1.5">
                                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                                      {menu.items.slice(0, 3).join(', ')}{menu.items.length > 3 ? '…' : ''}
                                    </p>
                                    <button
                                      onClick={() => openEdit(menu)}
                                      className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
                                    >
                                      <FiEdit2 size={10} /> Edit
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => openAdd(date, mealType)}
                                    className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-emerald-400 hover:text-emerald-600"
                                  >
                                    <FiPlus size={11} /> Add
                                  </button>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* All set menus list */}
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3.5">
                <FiList size={14} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">All Set Menus This Week</span>
                <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                  {totalSet} entries
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/40">
                      {['Date', 'Meal', 'Timing', 'Items', 'Action'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {weekDates.flatMap(({ date }) =>
                      mealTypes.map(mealType => {
                        const menu = getMenuByDate(date).find(m => m.mealType === mealType);
                        if (!menu) return null;
                        const cfg = mealConfig[mealType];
                        return (
                          <tr key={`${date}-${mealType}`} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-5 py-3.5 text-xs text-slate-500">{date}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>
                                {cfg.emoji} {mealType}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <FiClock size={11} /> {menu.timing}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-slate-600 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {menu.items.map((item, i) => (
                                  <span key={i} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-slate-600">{item}</span>
                                ))}
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => openEdit(menu)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-95"
                              >
                                <FiEdit2 size={11} /> Edit
                              </button>
                            </td>
                          </tr>
                        );
                      }).filter(Boolean)
                    )}
                    {totalSet === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-sm text-slate-400">
                          No menus planned yet. Use the planner above to add meals.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ───────────────────────────────────── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit — ${editing.mealType}` : 'Add Menu'}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Meal Type</label>
            <select
              value={form.mealType}
              onChange={e => setForm(f => ({ ...f, mealType: e.target.value, timing: mealTimings[e.target.value] }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {mealTypes.map(t => <option key={t} value={t}>{mealConfig[t].emoji} {t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Timing</label>
            <input
              value={form.timing}
              onChange={e => setForm(f => ({ ...f, timing: e.target.value }))}
              placeholder="e.g. 7:30 AM – 9:30 AM"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Items <span className="normal-case font-normal text-slate-400">(comma separated)</span>
            </label>
            <textarea
              rows={4}
              value={form.items}
              onChange={e => setForm(f => ({ ...f, items: e.target.value }))}
              placeholder="Idli, Sambar, Coconut Chutney, Tea"
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Update Menu' : 'Add Menu'}
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
