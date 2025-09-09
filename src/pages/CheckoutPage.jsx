import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  collection,
  doc,
  runTransaction,
  query,
  where,
  getDocs,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ChevronRight } from "lucide-react";

const CheckoutPage = () => {
  const { user, isLoggedIn } = useAuth(); // ✅ updated
  const { cart, totalCartValue, clearCart, loadingCart } = useCart();
  const navigate = useNavigate();

  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loadingCart) {
      if (!isLoggedIn || !user?.uid) {
        navigate("/login?redirect=/checkout");
      } else if (cart.length === 0) {
        navigate("/products");
      }
    }
  }, [isLoggedIn, user, cart, loadingCart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    // Ensure shipping details are filled
    for (const key in shippingDetails) {
      if (!shippingDetails[key]) {
        setError("Please fill in all shipping details.");
        return;
      }
    }

    setLoading(true);
    const newOrderRef = doc(collection(db, "orders"));

    try {
      await runTransaction(db, async (transaction) => {
        const inventoryDocs = new Map();
        const inventoryRefs = new Map();

        for (const item of cart) {
          const productName =
            item.displayName ||
            (item.variant ? `${item.name} (${item.variant.size})` : item.name);

          const inventoryQuery = query(
            collection(db, "inventory_items"),
            where("productName", "==", productName),
            limit(1)
          );

          const inventorySnapshot = await getDocs(inventoryQuery);
          if (inventorySnapshot.empty) {
            throw new Error(
              `We're sorry, "${productName}" is currently out of stock.`
            );
          }

          const inventoryDocRef = inventorySnapshot.docs[0].ref;
          const inventoryDoc = await transaction.get(inventoryDocRef);

          inventoryRefs.set(productName, inventoryDocRef);
          inventoryDocs.set(productName, inventoryDoc);
        }

        // Check stock
        for (const item of cart) {
          const productName =
            item.displayName ||
            (item.variant ? `${item.name} (${item.variant.size})` : item.name);
          const inventoryDoc = inventoryDocs.get(productName);

          if (!inventoryDoc.exists()) {
            throw new Error(
              `Inventory data for "${productName}" could not be read.`
            );
          }

          const currentStock = inventoryDoc.data().currentStock;
          if (currentStock < item.quantity) {
            throw new Error(
              `Not enough stock for "${productName}". Only ${currentStock} available.`
            );
          }
        }

        const orderId = newOrderRef.id.substring(0, 8).toUpperCase();

        transaction.set(newOrderRef, {
          userId: user.uid,
          userEmail: user.email,
          items: cart,
          totalAmount: totalCartValue,
          shippingDetails,
          status: "Pending",
          createdAt: serverTimestamp(),
          orderId,
        });

        // Inventory updates will be handled by backend/Cloud Functions
      });

      await clearCart();
      navigate(`/order-success/${newOrderRef.id}`);
    } catch (err) {
      console.error("Transaction failed: ", err);
      setError(
        err.message ||
          "Failed to place order. Please check stock and try again."
      );
      setLoading(false);
    }
  };

  if (loadingCart || !isLoggedIn || !user || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-red-600">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-semibold text-gray-800">Checkout</span>
        </div>

        <form
          onSubmit={handlePlaceOrder}
          className="lg:grid lg:grid-cols-3 lg:gap-8 items-start"
        >
          {/* Shipping Details */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={shippingDetails.name}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                name="address"
                id="address"
                required
                value={shippingDetails.address}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border rounded-md"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="state">State / Province</label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  required
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  required
                  value={shippingDetails.pincode}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 border-b pb-4 mb-4">
                {cart.map((item) => (
                  <div
                    key={item.cartKey}
                    className="flex justify-between text-sm"
                  >
                    <p className="text-gray-600">
                      {item.displayName || item.name} x{item.quantity}
                    </p>
                    <p className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900">
                <p>Total</p>
                <p>₹{totalCartValue.toFixed(2)}</p>
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
