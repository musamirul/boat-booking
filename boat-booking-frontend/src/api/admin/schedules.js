import axios from "axios";
const BASE_URL = "http://localhost/boat-booking/public/api/admin";

export const getSchedules = () =>
  axios.get(`${BASE_URL}/schedules.php`);

export const deleteSchedule = (id) =>
  axios.delete(`${BASE_URL}/schedules.php?id=${id}`);

export const updateSchedule = (data) => 
    axios.patch(`${BASE_URL}/schedules.php`, data);

export const addSchedule = (schedule) =>
    axios.post(`${BASE_URL}/schedules.php`,schedule);

//Create a new schedule
export const createSchedule = (data) =>
  axios.post(`${BASE_URL}/schedules.php`,data);

//Add price for each ticket type
export const addSchedulePrice = (data) => {
  console.log('Sending price data:', data);  // ✅ debug
  return axios.post(`${BASE_URL}/schedule_prices.php`, data);
};

// ✅ Fetch prices for a specific schedule
export const getSchedulePrices = (scheduleId) =>
  axios.get(`${BASE_URL}/schedule_prices.php?schedule_id=${scheduleId}`);


