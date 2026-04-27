import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

function CircularProgress({ value }) {
  const size = 100;
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const strokeColor = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
  const textColorClass = value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className={`absolute text-lg font-bold ${textColorClass}`}>{value}</span>
    </div>
  );
}

const scoreHistory = [
  { week: 'W1', score: 75 }, { week: 'W2', score: 80 },
  { week: 'W3', score: 72 }, { week: 'W4', score: 85 },
  { week: 'W5', score: 88 }, { week: 'W6', score: 90 },
  { week: 'W7', score: 92 }, { week: 'W8', score: 92 },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { bookings } = useBooking();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', hostel: user?.hostel || '', room: user?.room || '' });
  const [notifications, setNotifications] = useState({ email: true, reminder: true, weekly: false });
  const [toast, setToast] = useState(null);

  const allBookings = bookings;
  const attended = allBookings.filter(b => b.status === 'Attended').length;
  const missed = allBookings.filter(b => b.status === 'Missed').length;
  const pending = allBookings.filter(b => ['Booked', 'Upcoming'].includes(b.status)).length;
  const score = user?.accountabilityScore ?? 100;

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const handleSave = async () => {
    const result = await updateUser(formData);
    setEditing(false);
    if (result.success) {
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } else {
      setToast({ message: result.message || 'Failed to update profile', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
      <StudentNavbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 lg:py-8 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-emerald-100">{user?.email}</p>
              <div className="flex gap-3 mt-2 text-sm flex-wrap">
                <span className="bg-white/15 px-3 py-1 rounded-full">🏠 Hostel {user?.hostel}</span>
                <span className="bg-white/15 px-3 py-1 rounded-full">🚪 Room {user?.room}</span>
                <span className="bg-white/15 px-3 py-1 rounded-full font-semibold">⭐ Score {score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="space-y-6">
            {/* Accountability Score */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Accountability Score</h2>
              <CircularProgress value={score} />
              <p className="text-sm text-gray-500 mt-2">
                {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>

            {/* Stats */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold">{allBookings.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attended</span>
                  <span className="font-semibold text-green-600">{attended}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Missed</span>
                  <span className="font-semibold text-red-500">{missed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-amber-600">{pending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attendance Rate</span>
                  <span className="font-semibold">{allBookings.length > 0 ? Math.round((attended / allBookings.length) * 100) : 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score History */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Score History (8 Weeks)</h2>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={scoreHistory}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Edit Profile */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Profile Details</h2>
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium">
                      <FiSave size={14} /> Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm">
                      <FiX size={14} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium">
                    <FiEdit2 size={14} /> Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                  {editing ? (
                    <input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  ) : (
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email</label>
                  <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Hostel</label>
                    {editing ? (
                      <select value={formData.hostel} onChange={e => setFormData(f => ({ ...f, hostel: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
                        {['A', 'B', 'C', 'D', 'E'].map(h => <option key={h} value={h}>Hostel {h}</option>)}
                      </select>
                    ) : (
                      <p className="text-sm font-medium text-gray-800">Hostel {user?.hostel}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Room</label>
                    {editing ? (
                      <input value={formData.room} onChange={e => setFormData(f => ({ ...f, room: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                    ) : (
                      <p className="text-sm font-medium text-gray-800">{user?.room}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Booking confirmations and updates' },
                  { key: 'reminder', label: 'Meal Reminders', desc: '30 min before meal time' },
                  { key: 'weekly', label: 'Weekly Summary', desc: 'Attendance and score report' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                        ${notifications[key] ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                        ${notifications[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
