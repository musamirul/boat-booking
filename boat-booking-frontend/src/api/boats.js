import axios from 'axios';

const BASE_URL = 'http://localhost/boat-booking/public/api';

  export const getBoats = () =>
    axios.get(`${BASE_URL}/boats.php`);
  
  export const createBoat = (data) =>
    axios.post(`${BASE_URL}/boats.php`, data); 

  export const deleteBoat = (boat_id) =>
    axios.delete(`${BASE_URL}/boats.php?boat_id=${boat_id}`);

  export const updateBoat = (data) =>
    axios.put(`${BASE_URL}/boats.php`,data);

