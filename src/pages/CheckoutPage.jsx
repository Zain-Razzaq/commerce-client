import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { getUserCart, clearLocalCart } from "@/api/cart";
import { createOrder } from "@/api/orders";

const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        let cartItems = [];
        if (authLoading) return;
        const response = await getUserCart();
        if (response.success) {
          cartItems = response.data;
        }

        if (cartItems.length === 0) {
          toast.error("Your cart is empty");
          navigate("/cart");
          return;
        }

        setCartProducts(cartItems);
      } catch {
        toast.error("Failed to load cart");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    if (!user && !authLoading) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    loadCart();
  }, [user, navigate, authLoading]);

  const getCartTotal = () => {
    return cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (deliveryAddress.length < 6) {
      toast.error("Delivery address must be at least 6 characters long");
      return;
    }

    if (cartProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        shipping_address: deliveryAddress.trim(),
        products: cartProducts.map((product) => ({
          product_id: product.id,
          quantity: product.quantity,
        })),
      };

      const response = await createOrder(orderData);

      if (response.success) {
        clearLocalCart();
        toast.success("Order placed successfully!");
        navigate("/orders");
      } else {
        toast.error(response.error);
      }
    } catch {
      toast.error("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-quaternary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-quaternary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Details
            </h2>

            <form onSubmit={handleSubmitOrder}>
              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete delivery address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !deliveryAddress.trim()}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-500">
                      ${product.price} × {product.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
