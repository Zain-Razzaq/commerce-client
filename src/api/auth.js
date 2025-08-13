import axios from "axios";
import { USER_LOGIN_API_URL, USER_REGISTRATION_API_URL, USER_LOGOUT_API_URL } from "@/routes";

export const loginApi = async (email, password) => {
  try {
    const response = await axios.post(
      USER_LOGIN_API_URL,
      { email, password },
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.error };
  }
};

export const signupApi = async (name, email, password) => {
  try {
    const response = await axios.post(
      USER_REGISTRATION_API_URL,
      { name, email, password },
      { withCredentials: true }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.error };
  }
};

export const logoutApi = async () => {
  try {
    const response = await axios.delete(USER_LOGOUT_API_URL, { withCredentials: true });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error: error.response.data.error };
  }
};