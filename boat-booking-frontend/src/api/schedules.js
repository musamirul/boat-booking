import axios from "axios";
const BASE_URL = "http://localhost/boat-booking/public/api";

export const getSchedules = () =>
  axios.get(`${BASE_URL}/schedules.php`);

export const deleteSchedule = (id) =>
  axios.delete(`${BASE_URL}/schedules.php?id=${id}`);

export const updateSchedule = (data) => 
    axios.patch(`${BASE_URL}/schedules.php`, data);