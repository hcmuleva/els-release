import API from '../api';

const gradeService = {
  async getAllGrades(params = {}) {
    const response = await API.get('/grades', { params });
    return response.data.data;
  },

  async getGradeById(documentId) {
    const response = await API.get(`/grades/${documentId}`);
    return response.data.data;
  },

  async createGrade(gradeData) {
    const response = await API.post('/grades', { data: gradeData });
    return response.data.data;
  },

  async updateGrade(documentId, gradeData) {
    const response = await API.put(`/grades/${documentId}`, { data: gradeData });
    return response.data.data;
  },

  async deleteGrade(documentId) {
    await API.delete(`/grades/${documentId}`);
    return true;
  },
};

export default gradeService;
