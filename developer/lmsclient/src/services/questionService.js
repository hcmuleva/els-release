import API from '../api';

const questionService = {
  async getAllQuestions(filters = {}) {
    const params = new URLSearchParams();

    if (filters.subject) params.append('filters[subject][id][$eq]', filters.subject);
    if (filters.course) params.append('filters[course][id][$eq]', filters.course);
    if (filters.questionType) params.append('filters[questionType][$eq]', filters.questionType);
    if (filters.difficultyLevel) params.append('filters[difficultyLevel][$eq]', filters.difficultyLevel);

    params.append('populate', '*');

    const response = await API.get(`/questions?${params.toString()}`);
    return response.data;
  },

  async getQuestion(id) {
    const response = await API.get(`/questions/${id}?populate=*`);
    return response.data;
  },

  async createQuestion(questionData) {
    const response = await API.post('/questions', { data: questionData });
    return response.data;
  },

  async updateQuestion(id, questionData) {
    const response = await API.put(`/questions/${id}`, { data: questionData });
    return response.data;
  },

  async deleteQuestion(id) {
    const response = await API.delete(`/questions/${id}`);
    return response.data;
  },

  async getQuestionsBySubject(subjectId) {
    const response = await API.get(
      `/questions?filters[subject][id][$eq]=${subjectId}&populate=*`
    );
    return response.data;
  },

  async getQuestionsByCourse(courseId) {
    const response = await API.get(
      `/questions?filters[course][id][$eq]=${courseId}&populate=*`
    );
    return response.data;
  },
};

export default questionService;
