import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/CheckoutPage.css";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    userName: "",
    streetAddress: "",
    city: "",
    province: "",
    zipCode: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to proceed with checkout.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5002/api/users/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
      calculateTotal(response.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to load cart for checkout.");
    }
  };

  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * (item.quantity || 1),
      0
    );
    setTotal(total);
  };

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
  
    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }
  
    try {
      console.log("Shipping Info Sent:", shippingInfo);
      const response = await axios.post(
        "http://localhost:5002/api/users/cart/checkout",
        { shippingAddress: shippingInfo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Order Response:", response.data);
      alert("Order placed successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error during checkout:", error.response?.data || error.message);
      alert("Checkout failed. Please try again.");
    }
  };  

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <div className="checkout-form">
        <div>
          <h3>Shipping Address</h3>
          <form>
            <label>
              Username:
              <input
                type="text"
                name="userName"
                value={shippingInfo.userName}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Street Address:
              <input
                type="text"
                name="streetAddress"
                value={shippingInfo.streetAddress}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={shippingInfo.city}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Province:
              <input
                type="text"
                name="province"
                value={shippingInfo.province}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                required
              />
            </label>
          </form>
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.product._id}>
              <p>
                {item.product.name} - ${item.product.price.toFixed(2)} x{" "}
                {item.quantity || 1}
              </p>
            </div>
          ))}
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={handleCheckout}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
