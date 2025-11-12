import API from '../api';

const enrolmentService = {
  async getAllEnrolments(params = {}) {
    const response = await API.get('/enrolments', {
      params: { populate: '*', ...params },
    });
    return response.data.data;
  },

  async getEnrolmentById(documentId) {
    const response = await API.get(`/enrolments/${documentId}?populate=*`);
    return response.data.data;
  },

  async getEnrolmentsByCourse(courseId) {
    const response = await API.get('/enrolments', {
      params: { 'filters[course][id][$eq]': courseId, populate: '*' },
    });
    return response.data.data;
  },

  async createEnrolment(enrolmentData) {
    const response = await API.post('/enrolments', { data: enrolmentData });
    return response.data.data;
  },

  async updateEnrolment(documentId, enrolmentData) {
    const response = await API.put(`/enrolments/${documentId}`, { data: enrolmentData });
    return response.data.data;
  },

  async assignUsers(documentId, { teachers = [], students = [] }) {
    const response = await API.put(`/enrolments/${documentId}`, {
      data: { teachers, students },
    });
    return response.data.data;
  },

  async deleteEnrolment(documentId) {
    await API.delete(`/enrolments/${documentId}`);
    return true;
  },
};

export default enrolmentService;
