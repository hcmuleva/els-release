import api from "../api";

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.first_name - First name
 * @param {string} userData.last_name - Last name
 * @param {string} userData.mobile_number - Mobile number
 */
export const register = async (userData) => {
  try {
    const payload = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name,
      last_name: userData.last_name,
      mobile_number: userData.mobile_number,
      user_role: userData.user_role,
    };

    ["dob", "start_date", "end_date"].forEach((field) => {
      if (userData[field]) {
        payload[field] = userData[field];
      }
    });

    const response = await api.post("/auth/local/register", payload);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 * @param {string} identifier - Username or email
 * @param {string} password - Password
 */
export const login = async (identifier, password) => {
  try {
    const response = await api.post("/auth/local", {
      identifier,
      password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
};
