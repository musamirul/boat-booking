import axios from 'axios';

const BASE_URL = 'http://localhost/boat-booking/public/api';

//Fetch all schedules
export const getSchedulesPrices = (scheduleId) =>
    axios.get(`${BASE_URL}/schedules_prices.php`,{params:{schedule_id: scheduleId}});
