import axios from 'axios';
const BASE_URL = 'http://localhost/boat-booking/public/api/user';

export const getCart = (userId) =>
    axios.get(`${BASE_URL}/cart.php?user_id=${userId}`);

export const addToCart = (data) =>
    axios.post(`${BASE_URL}/cart.php`, data);

export const removeCartItem = (itemId) =>
    axios.delete(`${BASE_URL}/cart.php?cart_item_id=${itemId}`);

// Clear all cart items for a specific user
export const clearCart = (userId) =>
    axios.delete(`${BASE_URL}/cart.php?user_id=${userId}&clear_all=1`);
