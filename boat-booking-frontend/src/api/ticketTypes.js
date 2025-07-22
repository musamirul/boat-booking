import axios from 'axios';
const BASE_URL = 'http://localhost/boat-booking/public/api';

export const getTicketTypes = () =>
    axios.get(`${BASE_URL}/ticket-types.php`);