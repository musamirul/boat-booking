import { useEffect, useState } from "react";
import { getCart, removeCartItem } from "../../api/user/cart";
import { createBooking } from "../../api/user/bookings";

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const userId = 1; // from auth
  
    useEffect(() => { loadCart(); }, []);
  
    const loadCart = async () => {
      const res = await getCart(userId);
      setCart(res.data);
    };
  
    const checkout = async () => {
      const payload = { user_id: userId, items: cart.items.map(i => ({
        schedule_id: i.schedule_id,
        ticket_type_id: i.ticket_type_id,
        quantity: i.quantity
      })) };
      await createBooking(payload);
      alert("Booking successful, proceed to payment!");
    };
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Cart</h1>
        {!cart?.items?.length ? <p>Your cart is empty</p> :
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr><th>Boat</th><th>Tickets</th><th>Action</th></tr>
            </thead>
            <tbody>
              {cart.items.map(i => (
                <tr key={i.cart_item_id}>
                  <td className="border p-2">{i.boat_name}</td>
                  <td className="border p-2">{i.quantity}</td>
                  <td className="border p-2">
                    <button className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => removeCartItem(i.cart_item_id).then(loadCart)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
        {cart?.items?.length > 0 && <button onClick={checkout} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>}
      </div>
    );
  }