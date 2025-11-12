import API from '../api';

const courseService = {
  async getAllCourses(params = {}) {
    const { page = 1, pageSize = 25, filters = {}, sort = '' } = params;
    let query = `?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

    Object.keys(filters).forEach((key) => {
      query += `&filters[${key}][$eq]=${filters[key]}`;
    });

    if (sort) query += `&sort=${sort}`;

    const response = await API.get(`/courses${query}`);
    return response.data;
  },

  async getCourseById(documentId) {
    const response = await API.get(`/courses/${documentId}?populate=*`);
    return response.data;
  },

  async createCourse(courseData) {
    const response = await API.post('/courses', { data: courseData });
    return response.data;
  },

  async updateCourse(documentId, courseData) {
    const response = await API.put(`/courses/${documentId}`, { data: courseData });
    return response.data;
  },

  async deleteCourse(documentId) {
    const response = await API.delete(`/courses/${documentId}`);
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

  parseDescription(description) {
    if (!Array.isArray(description)) return '';
    return description.map(block =>
      block.children?.map(child => child.text || '').join(' ')
    ).join('\n');
  },

  formatDescription(text) {
    if (!text) return [];
    return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
  },
};

export default courseService;
