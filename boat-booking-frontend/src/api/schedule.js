import axios from 'axios';

const BASE_URL = 'http://localhost/boat-booking/public/api';

//Fetch all schedules
export const getSchedules = () =>
    axios.get(`${BASE_URL}/schedules.php`);

//Create a new schedule
export const createSchedule = (data) =>
    axios.post(`${BASE_URL}/schedules.php`,data);

//Add price for each ticket type
export const addSchedulePrice = (data) =>
    axios.post(`${BASE_URL}/schedule_prices.php`,data);