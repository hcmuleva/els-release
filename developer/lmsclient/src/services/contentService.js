import API from '../api';

const contentService = {
  async getAllContents(params = {}) {
    const response = await API.get('/contents', {
      params: { populate: '*', ...params },
    });
    return response.data.data;
  },

  async getContentById(documentId) {
    const response = await API.get(`/contents/${documentId}?populate=*`);
    return response.data.data;
  },

  async getContentsBySubject(subjectId) {
    const response = await API.get('/contents', {
      params: { 'filters[subject][id][$eq]': subjectId, populate: '*' },
    });
    return response.data.data;
  },

  async getContentsByTeacher(teacherId) {
    const response = await API.get('/contents', {
      params: { 'filters[teacher][id][$eq]': teacherId, populate: '*' },
    });
    return response.data.data;
  },

  async createContent(contentData) {
    const response = await API.post('/contents', { data: contentData });
    return response.data.data;
  },

  async updateContent(documentId, contentData) {
    const response = await API.put(`/contents/${documentId}`, { data: contentData });
    return response.data.data;
  },

  async deleteContent(documentId) {
    await API.delete(`/contents/${documentId}`);
    return true;
  },

  async uploadMedia(files) {
    const formData = new FormData();
    (Array.isArray(files) ? files : [files]).forEach(f => formData.append('files', f));

    const response = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default contentService;
