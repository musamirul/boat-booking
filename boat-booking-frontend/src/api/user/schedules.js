import axios from 'axios';

const BASE_URL = "http://localhost/boat-booking/public/api/user";

export const getSchedules = () =>
    axios.get(`${BASE_URL}/schedules.php`);

export const addSchedule = (schedule) =>
    axios.post(`${BASE_URL}/schedules.php`,schedule);

export const updateSchedule = (data) => 
    axios.patch(`${BASE_URL}/schedules.php`, data);

export const deleteSchedule = (id) =>
    axios.delete(`${BASE_URL}/schedules.php?id=${id}`);