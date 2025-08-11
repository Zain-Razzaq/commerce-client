import axios from "axios";
import {
  ALL_CATEGORIES_API_URL,
  CREATE_CATEGORY_API_URL,
  UPDATE_CATEGORY_API_URL,
  DELETE_CATEGORY_API_URL,
} from "@/routes";

export const getAllCategories = async () => {
  try {
    const response = await axios.get(ALL_CATEGORIES_API_URL, {
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

export const createCategory = async (category) => {
  try {
    const response = await axios.post(CREATE_CATEGORY_API_URL, category, {
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

export const updateCategory = async (id, category) => {
  try {
    const response = await axios.put(
      UPDATE_CATEGORY_API_URL.replace(":id", id),
      category,
      {
        withCredentials: true,
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

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      DELETE_CATEGORY_API_URL.replace(":id", id),
      {
        withCredentials: true,
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
