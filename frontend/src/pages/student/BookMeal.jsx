import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useMenu } from '../../context/MenuContext';
import StudentNavbar from '../../components/StudentNavbar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

const mealTypes = [
  { type: 'Breakfast', timing: '7:30 AM – 9:30 AM', emoji: '🌅' },
  { type: 'Lunch', timing: '12:00 PM – 2:00 PM', emoji: '☀️' },
  { type: 'Dinner', timing: '7:00 PM – 9:00 PM', emoji: '🌙' },
];

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    });
  }
  return days;
}

export default function BookMeal() {
  const { user } = useAuth();
  const { bookings, addBooking, cancelBooking, loading: bookingLoading } = useBooking();
  const { getMenuByDate, menus, loading: menuLoading } = useMenu();

  const days = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(days[0].date);
  const [selectedMeal, setSelectedMeal] = useState('Lunch');
  const [specialRequest, setSpecialRequest] = useState('');
  const [toast, setToast] = useState(null);

  const studentId = user?._id;
  const menuItems = getMenuByDate(selectedDate).find(m => m.mealType === selectedMeal);
  const existingBooking = bookings.find(
    b => b.student?._id === studentId && b.date === selectedDate && b.mealType === selectedMeal
  );

  const isBooked = existingBooking && existingBooking.status !== 'Cancelled';

  const handleBook = async () => {
    if (isBooked) {
      const result = await cancelBooking(existingBooking._id);
      if (result.success) {
        setToast({ message: 'Booking cancelled successfully.', type: 'info' });
      } else {
        setToast({ message: result.message || 'Failed to cancel booking', type: 'error' });
      }
    } else {
      if (!menuItems) {
        setToast({ message: 'Menu not available for this meal', type: 'error' });
        return;
      }
      const result = await addBooking({
        menuId: menuItems._id,
        date: selectedDate,
        mealType: selectedMeal,
        specialRequest,
      });
      if (result.success) {
        setToast({ message: `${selectedMeal} booked for ${selectedDate}!`, type: 'success' });
        setSpecialRequest('');
      } else {
        setToast({ message: result.message || 'Failed to book meal', type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] flex flex-col">
      <StudentNavbar />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 lg:py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Book a Meal</h1>
          <p className="text-slate-500 text-sm mt-1">Plan your meal attendance with a clean and guided booking workflow.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Step 1: Select Date</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map(({ date, label }) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium border transition-all
                  ${selectedDate === date
                    ? 'bg-gradient-to-r from-green-700 to-emerald-600 text-white border-green-700 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Step 2: Select Meal Slot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mealTypes.map(({ type, timing, emoji }) => {
              const booking = bookings.find(
                b => b.student?._id === studentId && b.date === selectedDate && b.mealType === type
              );
              const booked = booking && booking.status !== 'Cancelled';
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMeal(type)}
                  className={`relative rounded-2xl border-2 p-4 text-left transition-all
                    ${selectedMeal === type
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm'
                      : 'border-slate-100 bg-slate-50 hover:border-emerald-300'}`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p className="font-semibold text-slate-800">{type}</p>
                  <p className="text-xs text-slate-500">{timing}</p>
                  {booked && (
                    <span className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                      Booked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {menuItems && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Step 3: Menu Preview</h2>
            <div className="flex flex-wrap gap-2">
              {menuItems.items.map((item, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm px-3 py-1 rounded-full">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Step 4: Special Request (Optional)</h2>
          <textarea
            rows={3}
            value={specialRequest}
            onChange={e => setSpecialRequest(e.target.value)}
            placeholder="E.g., less spicy, no onion, extra roti..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 resize-none"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-slate-800">{selectedMeal} on {selectedDate}</p>
              <p className="text-sm text-slate-500">{isBooked ? 'You already have a booking for this slot.' : 'Ready to confirm this meal booking.'}</p>
            </div>
            {isBooked && (
              <span className="bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">✅ Booked</span>
            )}
          </div>
          <button
            onClick={handleBook}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
              ${isBooked
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-gradient-to-r from-green-700 to-emerald-600 text-white hover:brightness-105 shadow-md'}`}
          >
            {isBooked ? '✕ Cancel Booking' : '✓ Confirm Booking'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
