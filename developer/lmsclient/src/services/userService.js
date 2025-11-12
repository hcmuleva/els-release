import API from '../api';

const userService = {
  async getAllUsers(role = null) {
    try {
      const params = role ? { 'filters[userRole][$eq]': role } : {};
      const response = await API.get('/users', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch users');
    }
  },

  getAllTeachers() {
    return userService.getAllUsers('teacher');
  },

  getAllStudents() {
    return userService.getAllUsers('student');
  },

  async getUserById(userId) {
    try {
      const response = await API.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch user');
    }
  },
};

export default userService;
