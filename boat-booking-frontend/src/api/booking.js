import axios from 'axios';

const BASE_URL = 'http://localhost/boat-booking/public/api';

export const getBookings = () =>
  axios.get(`${BASE_URL}/bookings.php`);

export const createBooking = (data) =>
  axios.post(`${BASE_URL}/bookings.php`, data);

export const updateBookingStatus = (id, status) =>
  axios.patch(`${BASE_URL}/bookings.php`, { booking_id: id, status });
