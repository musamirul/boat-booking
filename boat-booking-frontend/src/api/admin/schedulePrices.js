import axios from "axios";
const BASE_URL = "http://localhost/boat-booking/public/api/admin";

// ✅ Get prices for schedule
export const getSchedulePrices = (scheduleId) =>
  axios.get(`${BASE_URL}/schedule_prices.php?schedule_id=${scheduleId}`);

// ✅ Update price
// export const updatePrice = (priceId, price) =>
//   axios.patch(`${BASE_URL}/schedule_prices.php`, { schedule_price_id: priceId, price });
export const updatePrice = (schedule_price_id, price) =>
  axios.patch(`${BASE_URL}/schedule_prices.php`, { schedule_price_id, price })

// ✅ Add new price
export const addPrice = (scheduleId, ticket_type_id, price) =>
  axios.post(`${BASE_URL}/schedule_prices.php`, { schedule_id: scheduleId, ticket_type_id, price });


export const updateSchedulePrice = (schedule_price_id, price) =>
  axios.patch(`${BASE_URL}/schedule_prices.php`, { schedule_price_id, price });

export const addSchedulePrice = (priceData) =>
  axios.post(`${BASE_URL}/schedule_prices.php`, priceData);