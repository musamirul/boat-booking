import { useEffect, useState } from "react";
import { getCart, removeCartItem,clearCart } from "../../api/user/cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';

export default function BookingCart() {
  const [items, setItems] = useState([]);
  const { userId } = useAuth();
  const navigate = useNavigate();


  const fetchCart = () => {
    getCart(userId)
      .then((res) => {
        console.log("API raw response:", res);
        console.log("API response data:", res.data);
        setItems(Array.isArray(res.data) ? res.data : res.data.items || []);
      })
      .catch((err) => {
        console.error("Failed to fetch cart:", err);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = (id) => {
    removeCartItem(id).then(() => fetchCart());
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      await clearCart(userId);
      setItems([]); // clear locally as well
      navigate("/");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      alert("Failed to clear cart.");
    }
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <UserLayout>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart - { userId }</h2>
      {items.map((item) => (
        <div key={item.cart_item_id} className="border p-2 mb-2 flex justify-between">
          <div>
            {item.boat_name} - {item.departure_time} - {item.ticket_type} x {item.quantity}
          </div>
          <div>RM {item.price * item.quantity}</div>
          <button onClick={() => handleRemove(item.cart_item_id)} className="text-red-500 ml-2">
            Remove
          </button>
        </div>
      ))}
      <div className="mt-4 font-bold">Total: RM {total}</div>
      <button onClick={ handleCancel } className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Cancel
      </button>
      <button onClick={() => navigate("/confirm")} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Proceed to Confirm
      </button>
    </div>
    </UserLayout>
  );
}