import axios from "axios";

const API = "http://localhost/boat-booking/public/api/admin/schedules.php";
const PRICE_API = "http://localhost/boat-booking/public/api/admin/schedule_prices.php";

// ✅ Fetch all schedules
export const getAdminSchedules = () => axios.get(API);

// ✅ Create a new schedule
export const createAdminSchedule = (data) => axios.post(API, data);

// ✅ Delete a schedule
export const deleteAdminSchedule = (scheduleId) =>
  axios.delete(`${API}?schedule_id=${scheduleId}`);

// ✅ Get prices for a schedule
export const getSchedulePrices = (scheduleId) =>
  axios.get(`${PRICE_API}?schedule_id=${scheduleId}`);

// ✅ Update a price
export const updateSchedulePrice = (schedule_price_id, price) =>
  axios.put(PRICE_API, { schedule_price_id, price: parseFloat(price) });