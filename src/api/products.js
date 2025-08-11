import axios from "axios";
import {
  ALL_PRODUCT_API_URL,
  GET_PRODUCT_BY_ID_API_URL,
  CREATE_PRODUCT_API_URL,
  UPDATE_PRODUCT_API_URL,
  DELETE_PRODUCT_API_URL,
  SEARCH_PRODUCTS_API_URL,
} from "@/routes";

export const getAllProducts = async () => {
  try {
    const response = await axios.get(ALL_PRODUCT_API_URL, {
      withCredentials: true,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.message };
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(
      GET_PRODUCT_BY_ID_API_URL.replace(":id", id),
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.message };
  }
};

export const createProduct = async (product) => {
  try {
    const response = await axios.post(CREATE_PRODUCT_API_URL, product, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.message };
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await axios.put(
      UPDATE_PRODUCT_API_URL.replace(":id", id),
      product,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.message };
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      DELETE_PRODUCT_API_URL.replace(":id", id),
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.message };
  }
};

export const searchProducts = async (
  searchTerm,
  categoryId,
  minPrice,
  maxPrice
) => {
  try {
    const response = await axios.get(SEARCH_PRODUCTS_API_URL, {
      withCredentials: true,
      params: {
        name: searchTerm,
        category_id: categoryId,
        min_price: minPrice,
        max_price: maxPrice,
      },
    });
    return {
      success: true,
      data: response.data.products,
    };
  } catch (error) {
    return { success: false, error: error.response.data.message };
  }
};
