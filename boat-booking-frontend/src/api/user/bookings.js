import axios from 'axios';
const BASE_URL = 'http://localhost/boat-booking/public/api/user';

export const getBookings = (userId) =>
    axios.get(`${BASE_URL}/bookings.php?user_id=${userId}`);

export const createBooking = (data) =>
    axios.post(`${BASE_URL}/bookings.php`, data);

export const updateBookingStatus = (id, status) =>
    axios.patch(`${BASE_URL}/bookings.php`, { booking_id: id, status });
  
// Get user existing bookings
export const getUserBookings = (userId)=>
    axios.get(`${BASE_URL}/bookings.php?user_id=${userId}`);

export const getBookingDetails = (bookingId) =>
    axios.get(`${BASE_URL}/bookings.php?booking_id=${bookingId}`);
  

