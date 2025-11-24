import api from "../api";

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const deriveRole = (user) => {
  if (!user) {
    return "STUDENT";
  }

  if (user.user_role === "ADMIN") {
    return "ADMIN";
  }

  if (user.end_date) {
    const end = new Date(user.end_date);
    if (!Number.isNaN(end.getTime())) {
      return end < startOfToday() ? "ALUMNI" : "STUDENT";
    }
  }

  return user.user_role || "STUDENT";
};

const augmentUser = (user) => {
  if (!user) {
    return user;
  }

  const effectiveRole = deriveRole(user);

  return {
    ...user,
    effective_role: effectiveRole,
    display_role: effectiveRole,
  };
};

const augmentCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(augmentUser);
  }
  return augmentUser(payload);
};

const buildUserPayload = (userData = {}) => {
  const allowedFields = [
    "first_name",
    "last_name",
    "email",
    "mobile_number",
    "dob",
    "start_date",
    "end_date",
    "user_role",
    "user_status",
  ];

  const payload = {};

  allowedFields.forEach((field) => {
    if (field in userData) {
      const value = userData[field];
      if (value === "" || value === undefined) {
        payload[field] = null;
      } else {
        payload[field] = value;
      }
    }
  });

  return payload;
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}?populate=*`);
    return augmentUser(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Get all users with optional filters
 * @param {Object} filters - Filter parameters
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add pagination
    queryParams.append("populate", "*");

    // Add filters if provided
    if (filters.user_role) {
      queryParams.append("filters[user_role][$eq]", filters.user_role);
    }
    if (filters.user_status) {
      queryParams.append("filters[user_status][$eq]", filters.user_status);
    }
    if (filters.search) {
      queryParams.append(
        "filters[$or][0][first_name][$containsi]",
        filters.search
      );
      queryParams.append(
        "filters[$or][1][last_name][$containsi]",
        filters.search
      );
      queryParams.append(
        "filters[$or][2][username][$containsi]",
        filters.search
      );
      queryParams.append("filters[$or][3][email][$containsi]", filters.search);
    }
    if (filters.start_date) {
      queryParams.append("filters[start_date][$eq]", filters.start_date);
    }
    if (filters.end_date) {
      queryParams.append("filters[end_date][$eq]", filters.end_date);
    }

    const response = await api.get(`/users?${queryParams.toString()}`);
    return augmentCollection(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} userData - Updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(
      `/users/${userId}`,
      buildUserPayload(userData)
    );
    return augmentUser(response);
  } catch (error) {
    throw error;
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
  try {
    const allUsers = augmentCollection(await api.get("/users?populate=*"));

    const stats = {
      total: allUsers.length || 0,
      students:
        allUsers.filter((u) => u.effective_role === "STUDENT").length || 0,
      alumni: allUsers.filter((u) => u.effective_role === "ALUMNI").length || 0,
      admins: allUsers.filter((u) => u.effective_role === "ADMIN").length || 0,
    };

    return stats;
  } catch (error) {
    throw error;
  }
};
