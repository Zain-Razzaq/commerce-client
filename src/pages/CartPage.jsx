import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import CartItem from "@/components/CartItem";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getLocalCart, getUserCart } from "@/api/cart";

import { getProductsByIds } from "@/api/products";

const CartPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setLoading(true);
    try {
      let cartItems = [];
      if (authLoading) return;
      if (user) {
        // Get cart from API for logged-in users
        const response = await getUserCart();
        if (response.success) {
          cartItems = response.data;
        }
      } else {
        // Get cart from localStorage for guests
        cartItems = getLocalCart();
        const productsResponse = await getProductsByIds(
          cartItems.map((item) => item.productId)
        );
        if (productsResponse.success) {
          // add quantity to products
          cartItems = productsResponse.data.map((product) => ({
            ...product,
            quantity: cartItems.find((item) => item.productId === product.id)
              .quantity,
          }));
        }
      }
      setCartProducts(cartItems);
    } catch (error) {
      console.error("Error loading cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user, authLoading]);

  const getCartTotal = () => {
    let total = 0;
    cartProducts.forEach((product) => {
      total += product.price * product.quantity;
    });
    return total;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-quaternary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-quaternary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Shopping Cart
          </h1>

          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-gray-300 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.6 8M7 13l1.6-8M7 13v8a2 2 0 002 2h2M7 13H5.4M7 13L5.4 5M7 13l8 0"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-quaternary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Shopping Cart</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartProducts.map((product) => (
                <CartItem
                  key={product.cart_item_id}
                  product={product}
                  onUpdate={loadCart}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {user ? (
                  <Link
                    to="/checkout"
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 text-center">
                      Sign in to checkout
                    </p>
                    <Link
                      to="/login"
                      className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium block text-center"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <Link
                  to="/products"
                  className="w-full bg-white text-primary border border-primary py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium block text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
