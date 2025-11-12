import API from '../api';

const examService = {
  async getAllExams(filters = {}) {
    const params = new URLSearchParams();

    if (filters.subject) params.append('filters[subject][id][$eq]', filters.subject);
    if (filters.course) params.append('filters[course][id][$eq]', filters.course);
    if (filters.examType) params.append('filters[examType][$eq]', filters.examType);

    params.append('populate[questions]', '*');
    params.append('populate[course]', 'id,name,subtitle,description');
    params.append('populate[subject]', 'id,name,subtitle,description');
    params.append('populate[examAttempts]', '*');

    const response = await API.get(`/exams?${params.toString()}`);
    return response.data;
  },

  async getExam(id) {
    const params = new URLSearchParams();
    params.append('populate[questions]', '*');
    params.append('populate[course]', 'id,name,subtitle,description');
    params.append('populate[subject]', 'id,name,subtitle,description');
    params.append('populate[examAttempts]', '*');
    const response = await API.get(`/exams/${id}?${params.toString()}`);
    return response.data;
  },

  async createExam(examData) {
    const response = await API.post('/exams', { data: examData });
    return response.data;
  },

  async updateExam(id, examData) {
    const response = await API.put(`/exams/${id}`, { data: examData });
    return response.data;
  },

  async deleteExam(id) {
    const response = await API.delete(`/exams/${id}`);
    return response.data;
  },

  async getExamsByCourse(courseId) {
    const response = await API.get(
      `/exams?filters[course][id][$eq]=${courseId}&populate=*`
    );
    return response.data;
  },

  async getExamsBySubject(subjectId) {
    const response = await API.get(
      `/exams?filters[subject][id][$eq]=${subjectId}&populate=*`
    );
    return response.data;
  },

  async getExamAttempts(examId) {
    const response = await API.get(
      `/exam-attempts?filters[exam][id][$eq]=${examId}&populate=*`
    );
    return response.data;
  },
};

export default examService;
