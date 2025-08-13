import axios from "axios";
import {
  GET_USER_CART_API_URL,
  UPDATE_CART_ITEM_API_URL,
  DELETE_CART_ITEM_API_URL,
  MERGE_CART_API_URL,
  ADD_TO_CART_API_URL,
} from "@/routes";

// Local storage cart management
export const getLocalCart = () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

export const saveLocalCart = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const addToLocalCart = (productId, quantity = 1) => {
  const cart = getLocalCart();
  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveLocalCart(cart);
  return cart;
};

export const updateLocalCartItem = (productId, quantity) => {
  const cart = getLocalCart();
  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex !== -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
    saveLocalCart(cart);
  }

  return cart;
};

export const removeFromLocalCart = (productId) => {
  const cart = getLocalCart();
  const updatedCart = cart.filter((item) => item.productId !== productId);
  saveLocalCart(updatedCart);
  return updatedCart;
};

export const clearLocalCart = () => {
  localStorage.removeItem("cart");
};

// API calls

export const getUserCart = async () => {
  try {
    const response = await axios.get(GET_USER_CART_API_URL, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch user cart",
    };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(
      ADD_TO_CART_API_URL,
      { product_id: productId, quantity },
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to add product to cart",
    };
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await axios.patch(
      UPDATE_CART_ITEM_API_URL.replace(":id", itemId),
      { quantity },
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update cart item",
    };
  }
};

export const deleteCartItem = async (itemId) => {
  try {
    const response = await axios.delete(
      DELETE_CART_ITEM_API_URL.replace(":id", itemId),
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete cart item",
    };
  }
};

export const mergeCart = async (localCartItems) => {
  try {
    const response = await axios.patch(
      MERGE_CART_API_URL,
      { cartItems: localCartItems },
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to merge cart",
    };
  }
};
