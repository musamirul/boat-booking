import { useEffect, useState } from "react";
import { getCart, removeCartItem, clearCart } from "../../api/user/cart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import UserLayout from '../../components/layouts/UserLayout';
import boatPlaceholder from "../../assets/boat-image.jpg";

export default function BookingCart() {
  const [items, setItems] = useState([]);
  const { userId } = useAuth();
  const navigate = useNavigate();
  const boat_image = boatPlaceholder;

  const fetchCart = () => {
    if (!userId) return;
    console.log("Fetching cart for userId:", userId);
    getCart(userId)
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const handleRemove = (id) => {
    removeCartItem(id).then(fetchCart);
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart(userId);
      setItems([]);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to clear cart.");
    }
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <UserLayout>
      <section>
  <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <div className="mx-auto max-w-3xl">
      <header className="text-center">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
      </header>
      {items.length === 0 && <div>Your cart is empty.</div>}

      <div className="mt-8">
        <ul className="space-y-4">
          {items.map(item => (
          <li key={item.cart_item_id} className="flex items-center gap-4">
            <img
              src={boat_image}
              alt=""
              className="size-16 rounded-sm object-cover"
            />

            <div>
              <h3 className="text-sm text-gray-900">{item.boat_name}</h3>

              <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                <div>
                  <dt className="inline">Departure Time : </dt>
                  <dd className="inline">{new Date(item.departure_time).toLocaleString()}</dd>
                </div>

                <div>
                  <dt className="inline">Total Ticket :</dt>
                  <dd className="inline">{item.ticket_type} x {item.quantity}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
              <form>
                <label htmlFor="Line1Qty" className="sr-only"> Quantity </label>

                <input
                  type="number"
                  min={item.quantity}
                  value={item.quantity}
                  id="Line1Qty"
                  className="h-8 w-12 rounded-sm border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-hidden [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                />
              </form>

              <button className="text-gray-600 transition hover:text-red-600">
                <span onClick={() => handleRemove(item.cart_item_id)} className="sr-only">Remove item</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </li>
          ))}
        </ul>

        {items.length > 0 && (
        <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
          <div className="w-screen max-w-lg space-y-4">
            <dl className="space-y-0.5 text-sm text-gray-700">
              <div className="flex justify-between !text-base font-medium">
                <dt>Total</dt>
                <dd>RM {total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="flex justify-end">
              <a
                href="#"
                onClick={handleCancel} className="block me-2 rounded-sm bg-red-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
              >
                Cancel
              </a>
              <a
                href="#"
                onClick={() => navigate("/confirm")} className="block rounded-sm bg-green-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
              >
                Proceed to Confirm
              </a>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  </div>
</section>
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {items.length === 0 && <div>Your cart is empty.</div>}

        {items.map(item => (
          <div key={item.cart_item_id} className="border p-2 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-semibold">{item.boat_name}</span>
              <span>{new Date(item.departure_time).toLocaleString()}</span>
              <span>{item.ticket_type} x {item.quantity}</span>
            </div>
            <div>RM {(item.price * item.quantity).toFixed(2)}</div>
            <button
              onClick={() => handleRemove(item.cart_item_id)}
              className="text-red-500 ml-2"
            >
              Remove
            </button>
          </div>
        ))}

        {items.length > 0 && (
          <>
            <div className="mt-4 font-bold text-lg">Total: RM {total.toFixed(2)}</div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/confirm")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Proceed to Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </UserLayout>
  );
}