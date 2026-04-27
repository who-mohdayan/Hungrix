const API_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined'
    ? `${window.location.origin}/backend/api`
    : 'http://localhost:5001/api'
);

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem('cfis_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('cfis_token', token);
    } else {
      localStorage.removeItem('cfis_token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async registerAdmin(userData) {
    const data = await this.request('/auth/register-admin', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateProfile(userData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // User endpoints
  async getAllStudents() {
    return this.request('/users/students');
  }

  async getStudentById(id) {
    return this.request(`/users/students/${id}`);
  }

  async updateStudent(id, userData) {
    return this.request(`/users/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteStudent(id) {
    return this.request(`/users/students/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudentStats(id) {
    return this.request(`/users/students/${id}/stats`);
  }

  // Menu endpoints
  async getAllMenus(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/menus${queryString ? `?${queryString}` : ''}`);
  }

  async getMenuByDate(date) {
    return this.request(`/menus/date/${date}`);
  }

  async getMenuById(id) {
    return this.request(`/menus/${id}`);
  }

  async createMenu(menuData) {
    return this.request('/menus', {
      method: 'POST',
      body: JSON.stringify(menuData),
    });
  }

  async updateMenu(id, menuData) {
    return this.request(`/menus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuData),
    });
  }

  async deleteMenu(id) {
    return this.request(`/menus/${id}`, {
      method: 'DELETE',
    });
  }

  // Booking endpoints
  async getAllBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bookings${queryString ? `?${queryString}` : ''}`);
  }

  async getMyBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }

  async getBookingsByDate(date) {
    return this.request(`/bookings/date/${date}`);
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async markAsAttended(id) {
    return this.request(`/bookings/${id}/attend`, {
      method: 'PUT',
    });
  }

  async markAsMissed(id) {
    return this.request(`/bookings/${id}/miss`, {
      method: 'PUT',
    });
  }

  // Analytics endpoints
  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics${queryString ? `?${queryString}` : ''}`);
  }

  async getMealPopularity(period = 30) {
    return this.request(`/analytics/meal-popularity?period=${period}`);
  }

  async getSustainabilityMetrics() {
    return this.request('/analytics/sustainability');
  }

  async getStudentAccountability() {
    return this.request('/analytics/student-accountability');
  }

  async getOverviewStats() {
    return this.request('/analytics/overview');
  }

  async getRealtimeAnalytics() {
    return this.request('/analytics/realtime');
  }

  async getBookingHeatmap(days = 30) {
    return this.request(`/analytics/heatmap?days=${days}`);
  }

  async getComparativeAnalysis(period = 30) {
    return this.request(`/analytics/comparative?period=${period}`);
  }

  // Prediction endpoints
  async getPredictions(days = 7) {
    return this.request(`/predictions?days=${days}`);
  }

  async getDemandForecast(date, mealType) {
    return this.request(`/predictions/demand-forecast?date=${date}&mealType=${mealType}`);
  }

  async getAnomalies(days = 30, threshold = 2.0) {
    return this.request(`/predictions/anomalies?days=${days}&threshold=${threshold}`);
  }

  async getInsights() {
    return this.request('/predictions/insights');
  }

  async getTodayMenuItems(mealType) {
    return this.request(`/prediction/today-menu-items?mealType=${mealType}`);
  }

  async getMenuPopularityScorePreview(mealType, menuItems = []) {
    const searchParams = new URLSearchParams();
    searchParams.set('mealType', mealType);
    (menuItems || []).forEach((item) => {
      if (item) searchParams.append('items', item);
    });
    return this.request(`/prediction/menu-popularity-score?${searchParams.toString()}`);
  }

  async getTodayPrediction(payload) {
    return this.request('/prediction/today', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getAttendanceHistory(days = 14) {
    return this.request(`/attendance/history?days=${days}`);
  }

  async getMealBookingStats(days = 7) {
    return this.request(`/admin/meal-booking-stats?days=${days}`);
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('cfis_user');
  }
}

export default new ApiService();
