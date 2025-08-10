import axios from "axios";

const BASE_URL = "http://localhost/boat-booking/public/api/admin";

export const getTicketTypes = () => axios.get(`${BASE_URL}/ticket_types.php`);
export const createTicketType = (data) => axios.post(`${BASE_URL}/ticket_types.php`, data);
export const updateTicketType = (data) => axios.patch(`${BASE_URL}/ticket_types.php`, data);
export const deleteTicketType = (id) => axios.delete(`${BASE_URL}/ticket_types.php?id=${id}`);