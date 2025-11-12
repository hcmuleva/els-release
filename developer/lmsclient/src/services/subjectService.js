import API from '../api';

const subjectService = {
  async getAllSubjects(params = {}) {
    const { page = 1, pageSize = 100, courseId = null } = params;
    let query = `?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    if (courseId) query += `&filters[course][documentId][$eq]=${courseId}`;
    const response = await API.get(`/subjects${query}`);
    return response.data.data;
  },

  async getSubjectsByCourse(courseDocumentId) {
    const response = await API.get(
      `/subjects?filters[course][documentId][$eq]=${courseDocumentId}&populate=*`
    );
    return response.data;
  },

  async getSubjectById(documentId) {
    const response = await API.get(`/subjects/${documentId}?populate=*`);
    return response.data;
  },

  async createSubject(subjectData) {
    const response = await API.post('/subjects', { data: subjectData });
    return response.data;
  },

  async updateSubject(documentId, subjectData) {
    const response = await API.put(`/subjects/${documentId}`, { data: subjectData });
    return response.data;
  },

  async deleteSubject(documentId) {
    const response = await API.delete(`/subjects/${documentId}`);
    return response.data;
  },

  async uploadCoverIcon(file) {
    const formData = new FormData();
    formData.append('files', file);
    const response = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default subjectService;
