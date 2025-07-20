import axios from 'axios';

const BASE_URL = 'http://localhost/boat-booking/public/api';

export const getBoats = () =>
    axios.get(`${BASE_URL}/boats.php`);
  
  export const createBoat = (data) =>
    axios.post(`${BASE_URL}/boats.php`, data); 