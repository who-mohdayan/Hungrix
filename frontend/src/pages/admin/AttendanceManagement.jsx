import { useEffect, useMemo, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiClock, FiSearch, FiUserX } from 'react-icons/fi';
import AdminLayout from '../../components/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import api from '../../services/api';

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function AttendanceManagement() {
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async (selectedDate) => {
    try {
      setLoading(true);
      const data = await api.getBookingsByDate(selectedDate);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching attendance bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(date);
  }, [date]);

  const handleMarkAttendance = async (bookingId, nextStatus) => {
    try {
      setActionLoadingId(`${bookingId}-${nextStatus}`);
      if (nextStatus === 'Attended') {
        await api.markAsAttended(bookingId);
      } else {
        await api.markAsMissed(bookingId);
      }

      setBookings((prev) => prev.map((booking) => (
        booking._id === bookingId ? { ...booking, status: nextStatus } : booking
      )));

      // notify other tabs/clients to refresh their booking lists
      try { localStorage.setItem('cfis_bookings_updated', Date.now().toString()); } catch (e) {}
    } catch (error) {
      console.error('Error updating attendance status:', error);
    } finally {
      setActionLoadingId('');
    }
  };

  const filteredBookings = useMemo(() => {
    let rows = [...bookings];

    if (statusFilter !== 'all') {
      if (statusFilter === 'Booked') {
        rows = rows.filter((booking) => ['Booked', 'Upcoming'].includes(booking.status));
      } else {
        rows = rows.filter((booking) => booking.status === statusFilter);
      }
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      rows = rows.filter((booking) => {
        const name = booking.student?.name?.toLowerCase() || '';
        const email = booking.student?.email?.toLowerCase() || '';
        const mealType = booking.mealType?.toLowerCase() || '';
        return name.includes(query) || email.includes(query) || mealType.includes(query);
      });
    }

    return rows;
  }, [bookings, search, statusFilter]);

  const summary = useMemo(() => ({
    total: bookings.length,
    booked: bookings.filter((booking) => ['Booked', 'Upcoming'].includes(booking.status)).length,
    attended: bookings.filter((booking) => booking.status === 'Attended').length,
    missed: bookings.filter((booking) => booking.status === 'Missed').length
  }), [bookings]);

  const mealSummary = useMemo(() => ({
    Breakfast: bookings.filter((booking) => booking.mealType === 'Breakfast').length,
    Lunch: bookings.filter((booking) => booking.mealType === 'Lunch').length,
    Dinner: bookings.filter((booking) => booking.mealType === 'Dinner').length,
  }), [bookings]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 lg:space-y-7">
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-emerald-950 to-orange-950 p-6 text-white shadow-xl lg:p-8">
          <div className="absolute -right-14 -top-12 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-orange-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Attendance Desk</p>
              <h1 className="mt-2 text-3xl font-semibold leading-tight lg:text-4xl">Attendance Management</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300">
                Confirm meal attendance quickly, catch missed check-ins, and keep accountability signals fresh across the system.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Date</p>
                <p className="mt-1 text-sm font-semibold">{formatDate(date)}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Pending</p>
                <p className="mt-1 text-xl font-semibold text-orange-200">{summary.booked}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Attended</p>
                <p className="mt-1 text-xl font-semibold text-emerald-200">{summary.attended}</p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-300">Missed</p>
                <p className="mt-1 text-xl font-semibold text-rose-200">{summary.missed}</p>
              </div>
            </div>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">Breakfast: {mealSummary.Breakfast}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">Lunch: {mealSummary.Lunch}</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">Dinner: {mealSummary.Dinner}</span>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Total Bookings</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{summary.total}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Pending</p>
            <p className="text-2xl font-semibold text-amber-600 mt-1">{summary.booked}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Attended</p>
            <p className="text-2xl font-semibold text-green-600 mt-1">{summary.attended}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-slate-500">Missed</p>
            <p className="text-2xl font-semibold text-rose-600 mt-1">{summary.missed}</p>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-4 lg:p-5 flex flex-wrap gap-3 items-center shadow-sm">
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 min-w-[210px]">
            <FiCalendar className="text-slate-400" size={16} />
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="bg-transparent text-sm text-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 min-w-[220px] lg:min-w-[280px]">
            <FiSearch className="text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, email, meal"
              className="bg-transparent text-sm text-slate-700 focus:outline-none w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 bg-slate-50 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Attended">Attended</option>
            <option value="Missed">Missed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <p className="ml-auto text-xs text-slate-500">Showing {filteredBookings.length} of {bookings.length}</p>
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 uppercase tracking-[0.08em] text-[11px]">Student</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 uppercase tracking-[0.08em] text-[11px]">Meal</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 uppercase tracking-[0.08em] text-[11px]">Hostel/Room</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 uppercase tracking-[0.08em] text-[11px]">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-600 uppercase tracking-[0.08em] text-[11px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
                      No bookings found for this filter.
                    </td>
                  </tr>
                )}
                {filteredBookings.map((booking) => {
                  const statusColor = booking.status === 'Attended'
                    ? 'bg-green-100 text-green-700'
                    : booking.status === 'Missed'
                      ? 'bg-rose-100 text-rose-700'
                      : ['Booked', 'Upcoming'].includes(booking.status)
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700';

                  const mealColor = booking.mealType === 'Breakfast'
                    ? 'bg-orange-100 text-orange-700'
                    : booking.mealType === 'Lunch'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700';

                  const disabledAction = booking.status === 'Cancelled';

                  return (
                    <tr key={booking._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-900">{booking.student?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{booking.student?.email || '-'}</p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${mealColor}`}>
                          {booking.mealType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-700">
                        Hostel {booking.student?.hostel || '-'} / Room {booking.student?.room || '-'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {/* Attend — solid teal pill with left accent bar */}
                          <button
                            type="button"
                            disabled={disabledAction || actionLoadingId === `${booking._id}-Attended`}
                            onClick={() => handleMarkAttendance(booking._id, 'Attended')}
                            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-emerald-500 py-1.5 pl-3.5 pr-4 text-xs font-bold uppercase tracking-wide text-white shadow-md transition-all duration-200 hover:bg-emerald-600 hover:shadow-emerald-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/30">
                              <FiCheckCircle size={10} />
                            </span>
                            {actionLoadingId === `${booking._id}-Attended` ? 'Saving…' : 'Attend'}
                          </button>

                          {/* Miss — ghost/outlined danger pill with dashed border */}
                          <button
                            type="button"
                            disabled={disabledAction || actionLoadingId === `${booking._id}-Missed`}
                            onClick={() => handleMarkAttendance(booking._id, 'Missed')}
                            className="group inline-flex items-center gap-2 rounded-full border-2 border-dashed border-rose-400 bg-white py-1.5 pl-3.5 pr-4 text-xs font-bold uppercase tracking-wide text-rose-500 transition-all duration-200 hover:border-rose-600 hover:bg-rose-600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FiUserX size={12} className="shrink-0" />
                            {actionLoadingId === `${booking._id}-Missed` ? 'Saving…' : 'Miss'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-start gap-3">
          <FiClock className="text-green-700 mt-0.5" size={16} />
          <p className="text-sm text-green-900">
            Marking attendance updates each student&apos;s attendance rate and accountability score automatically based on your backend rules.
          </p>
        </section>
      </div>
    </AdminLayout>
  );
}
