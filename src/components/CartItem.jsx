import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  updateLocalCartItem,
  removeFromLocalCart,
  updateCartItem,
  deleteCartItem,
} from "@/api/cart";

const CartItem = ({ product, onUpdate }) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > product.stock) return;

    setIsUpdating(true);
    try {
      if (user) {
        const response = await updateCartItem(
          product.cart_item_id,
          newQuantity
        );
        if (response.success) {
          toast.success("Cart updated successfully");
        } else {
          toast.error("Failed to update cart");
        }
      } else {
        updateLocalCartItem(product.id, newQuantity);
        toast.success("Cart updated successfully");
      }

      if (onUpdate) {
        await onUpdate();
      }
    } catch {
      toast.error("Failed to update cart");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      if (user) {
        const response = await deleteCartItem(product.cart_item_id);
        if (response.success) {
          toast.success("Product removed from cart successfully");
        } else {
          toast.error("Failed to remove product from cart");
        }
      } else {
        removeFromLocalCart(product.id);
        toast.success("Product removed from cart successfully");
      }

      if (onUpdate) {
        await onUpdate();
      }
    } catch {
      toast.error("Failed to remove product");
    } finally {
      setIsUpdating(false);
    }
  };

  const subtotal = product.price * product.quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden">
        {/* Top Row: Image, Details, Remove */}
        <div className="flex items-start gap-3 mb-3">
          {/* Product Image */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-grow min-w-0">
            <Link
              to={`/product/${product.id}`}
              className="font-medium text-primary hover:text-primary/80 block truncate"
            >
              {product.name}
            </Link>
            <p className="text-sm text-gray-500">${product.price}</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Remove from cart"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Bottom Row: Quantity Controls and Subtotal */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Qty:</span>
            <button
              onClick={() => handleQuantityChange(product.quantity - 1)}
              disabled={isUpdating || product.quantity <= 1}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="w-8 text-center font-medium">
              {product.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(product.quantity + 1)}
              disabled={isUpdating || product.quantity >= product.stock}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-right">
            <p className="font-semibold text-lg text-gray-900">
              ${subtotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-4">
        {/* Product Image */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <Link
            to={`/product/${product.id}`}
            className="font-medium text-primary hover:text-primary/80"
          >
            {product.name}
          </Link>
          <p className="text-sm text-gray-500">${product.price}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(product.quantity - 1)}
            disabled={isUpdating || product.quantity <= 1}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="w-8 text-center font-medium">
            {product.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(product.quantity + 1)}
            disabled={isUpdating || product.quantity >= product.stock}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="font-medium text-gray-900">${subtotal.toFixed(2)}</p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove from cart"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
