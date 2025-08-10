import axios from 'axios';
const BASE_URL = 'http://localhost/boat-booking/public/api/user';

export const makePayment = (data) =>
  axios.post(`${BASE_URL}/payments.php`, data);