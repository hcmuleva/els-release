import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const gradeService = {
  // Get all grades with optional filters
  getAllGrades: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/grades`, {
        ...getAuthHeader(),
        params
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch grades');
    }
  },

  // Get single grade by documentId
  getGradeById: async (documentId) => {
    try {
      const response = await axios.get(`${API_URL}/grades/${documentId}`, getAuthHeader());
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch grade');
    }
  },

  // Create a new grade
  createGrade: async (gradeData) => {
    try {
      const response = await axios.post(
        `${API_URL}/grades`,
        { data: gradeData },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create grade');
    }
  },

  // Update grade by documentId
  updateGrade: async (documentId, gradeData) => {
    try {
      const response = await axios.put(
        `${API_URL}/grades/${documentId}`,
        { data: gradeData },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update grade');
    }
  },

  // Delete grade by documentId
  deleteGrade: async (documentId) => {
    try {
      await axios.delete(`${API_URL}/grades/${documentId}`, getAuthHeader());
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete grade');
    }
  }
};

export default gradeService;
