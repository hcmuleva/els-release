import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const enrolmentService = {
  // Get all enrolments with populated data
  getAllEnrolments: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/enrolments`, {
        ...getAuthHeader(),
        params: {
          populate: '*',
          ...params
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch enrolments');
    }
  },

  // Get enrolment by documentId
  getEnrolmentById: async (documentId) => {
    try {
      const response = await axios.get(`${API_URL}/enrolments/${documentId}?populate=*`, getAuthHeader());
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch enrolment');
    }
  },

  // Get enrolments by course
  getEnrolmentsByCourse: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/enrolments`, {
        ...getAuthHeader(),
        params: {
          'filters[course][id][$eq]': courseId,
          populate: '*'
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch course enrolments');
    }
  },

  // Create new enrolment
  createEnrolment: async (enrolmentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/enrolments`,
        { data: enrolmentData },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create enrolment');
    }
  },

  // Update enrolment by documentId
  updateEnrolment: async (documentId, enrolmentData) => {
    try {
      const response = await axios.put(
        `${API_URL}/enrolments/${documentId}`,
        { data: enrolmentData },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update enrolment');
    }
  },

  // Assign teachers to course enrolment
  assignTeachers: async (documentId, teacherIds) => {
    try {
      const response = await axios.put(
        `${API_URL}/enrolments/${documentId}`,
        { 
          data: { 
            teachers: teacherIds 
          } 
        },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to assign teachers');
    }
  },

  // Assign students to course enrolment
  assignStudents: async (documentId, studentIds) => {
    try {
      const response = await axios.put(
        `${API_URL}/enrolments/${documentId}`,
        { 
          data: { 
            students: studentIds 
          } 
        },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to assign students');
    }
  },

  // Assign both teachers and students
  assignUsersToEnrolment: async (documentId, teacherIds, studentIds) => {
    try {
      const response = await axios.put(
        `${API_URL}/enrolments/${documentId}`,
        { 
          data: { 
            teachers: teacherIds,
            students: studentIds
          } 
        },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to assign users');
    }
  },

  // Delete enrolment by documentId
  deleteEnrolment: async (documentId) => {
    try {
      await axios.delete(`${API_URL}/enrolments/${documentId}`, getAuthHeader());
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete enrolment');
    }
  }
};

export default enrolmentService;
