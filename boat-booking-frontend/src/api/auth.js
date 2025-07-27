import axios from 'axios';

const BASE_URL = 'http://localhost/boat-booking/public/api';

export const registerUser = (userData) =>
    axios.post(`${BASE_URL}/register.php`,userData);

export const loginUser = (credentials) =>
    axios.post(`${BASE_URL}/login.php`,credentials);