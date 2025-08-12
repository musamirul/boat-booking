import axios from 'axios';

const BASE_URL = "http://localhost/boat-booking/public/api/user";

export const getUser = (userId)=>
    axios.get(`${BASE_URL}/user.php?user_id=${userId}`);