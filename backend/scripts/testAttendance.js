import fetch from 'node-fetch';

// Simple script to login as admin, fetch a booking, and mark it attended
// then query attendance collection to ensure record exists.

const API = process.env.API_URL || 'http://localhost:5001/api';

async function run() {
  try {
    // login as admin (credentials from seeder) 
    const loginRes = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campus.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'login failed');
    const token = loginData.token;
    console.log('token', token);

    // get some booking ID for student (first booking)
    const bookingsRes = await fetch(`${API}/bookings?limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const bookings = await bookingsRes.json();
    console.log('bookings', bookings.length);
    if (bookings.length === 0) return;
    const id = bookings[0]._id;
    console.log('marking booking', id);

    const attendRes = await fetch(`${API}/bookings/${id}/attend`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    const attendData = await attendRes.json();
    console.log('attend result', attendData);

    // get attendance records
    const attRes = await fetch(`${API}/analytics/realtime`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const attData = await attRes.json();
    console.log('realtime analytics', attData);
  } catch (err) {
    console.error(err);
  }
}

run();