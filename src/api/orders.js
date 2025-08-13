import axios from "axios";
import {
  CREATE_ORDER_API_URL,
  GET_ALL_ORDERS_API_URL,
  GET_USER_ORDERS_API_URL,
  UPDATE_ORDER_STATUS_API_URL,
  DELETE_ORDER_API_URL,
} from "@/routes";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(CREATE_ORDER_API_URL, orderData, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to create order",
    };
  }
};

// Get all orders (admin only)
export const getAllOrders = async () => {
  try {
    const response = await axios.get(GET_ALL_ORDERS_API_URL, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch orders",
    };
  }
};

// Get user's orders
export const getUserOrders = async () => {
  try {
    const response = await axios.get(GET_USER_ORDERS_API_URL, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch user orders",
    };
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId) => {
  try {
    const response = await axios.patch(
      UPDATE_ORDER_STATUS_API_URL.replace(":id", orderId),
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update order status",
    };
  }
};

// Delete order (admin only)
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(
      DELETE_ORDER_API_URL.replace(":id", orderId),
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to delete order",
    };
  }
};
