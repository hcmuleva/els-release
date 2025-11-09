import API from '../api';

const questionService = {
  // Get all questions
  getAllQuestions: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.subject) params.append('filters[subject][id][$eq]', filters.subject);
    if (filters.course) params.append('filters[course][id][$eq]', filters.course);
    if (filters.questionType) params.append('filters[questionType][$eq]', filters.questionType);
    if (filters.difficultyLevel) params.append('filters[difficultyLevel][$eq]', filters.difficultyLevel);
    
    params.append('populate', '*');
    
    const response = await API.get(`/api/questions?${params.toString()}`);
    return response.data;
  },

  // Get single question
  getQuestion: async (id) => {
    const response = await API.get(`/api/questions/${id}?populate=*`);
    return response.data;
  },

  // Create question
  createQuestion: async (questionData) => {
    const response = await API.post('/api/questions', {
      data: questionData
    });
    return response.data;
  },

  // Update question
  updateQuestion: async (id, questionData) => {
    const response = await API.put(`/api/questions/${id}`, {
      data: questionData
    });
    return response.data;
  },

  // Delete question
  deleteQuestion: async (id) => {
    const response = await API.delete(`/api/questions/${id}`);
    return response.data;
  },

  // Get questions by subject
  getQuestionsBySubject: async (subjectId) => {
    const response = await API.get(`/api/questions?filters[subject][id][$eq]=${subjectId}&populate=*`);
    return response.data;
  },

  // Get questions by course
  getQuestionsByCourse: async (courseId) => {
    const response = await API.get(`/api/questions?filters[course][id][$eq]=${courseId}&populate=*`);
    return response.data;
  }
};

export default questionService;
