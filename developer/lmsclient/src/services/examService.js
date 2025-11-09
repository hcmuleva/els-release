import API from '../api';

const examService = {
  // Get all exams
  getAllExams: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.subject) params.append('filters[subject][id][$eq]', filters.subject);
    if (filters.course) params.append('filters[course][id][$eq]', filters.course);
    if (filters.examType) params.append('filters[examType][$eq]', filters.examType);
    
    // Populate questions
    params.append('populate[questions]', '*');
    
    // Populate course with specific fields only (avoid media fields)
    params.append('populate[course][fields][0]', 'id');
    params.append('populate[course][fields][1]', 'name');
    params.append('populate[course][fields][2]', 'subtitle');
    params.append('populate[course][fields][3]', 'description');
    
    // Populate subject with specific fields only
    params.append('populate[subject][fields][0]', 'id');
    params.append('populate[subject][fields][1]', 'name');
    params.append('populate[subject][fields][2]', 'subtitle');
    params.append('populate[subject][fields][3]', 'description');
    
    // Populate exam attempts
    params.append('populate[examAttempts]', '*');
    
    const response = await API.get(`/api/exams?${params.toString()}`);
    return response.data;
  },

  // Get single exam
  getExam: async (id) => {
    const params = new URLSearchParams();
    
    // Populate questions
    params.append('populate[questions]', '*');
    
    // Populate course with specific fields
    params.append('populate[course][fields][0]', 'id');
    params.append('populate[course][fields][1]', 'name');
    params.append('populate[course][fields][2]', 'subtitle');
    params.append('populate[course][fields][3]', 'description');
    
    // Populate subject with specific fields
    params.append('populate[subject][fields][0]', 'id');
    params.append('populate[subject][fields][1]', 'name');
    params.append('populate[subject][fields][2]', 'subtitle');
    params.append('populate[subject][fields][3]', 'description');
    
    // Populate exam attempts
    params.append('populate[examAttempts]', '*');
    
    const response = await API.get(`/api/exams/${id}?${params.toString()}`);
    return response.data;
  },

  // Create exam
  createExam: async (examData) => {
    const response = await API.post('/api/exams', {
      data: examData
    });
    return response.data;
  },

  // Update exam
  updateExam: async (id, examData) => {
    const response = await API.put(`/api/exams/${id}`, {
      data: examData
    });
    return response.data;
  },

  // Delete exam
  deleteExam: async (id) => {
    const response = await API.delete(`/api/exams/${id}`);
    return response.data;
  },

  // Get exams by course
  getExamsByCourse: async (courseId) => {
    const params = new URLSearchParams();
    params.append('filters[course][id][$eq]', courseId);
    params.append('populate[questions]', '*');
    params.append('populate[course][fields][0]', 'id');
    params.append('populate[course][fields][1]', 'name');
    params.append('populate[subject][fields][0]', 'id');
    params.append('populate[subject][fields][1]', 'name');
    
    const response = await API.get(`/api/exams?${params.toString()}`);
    return response.data;
  },

  // Get exams by subject
  getExamsBySubject: async (subjectId) => {
    const params = new URLSearchParams();
    params.append('filters[subject][id][$eq]', subjectId);
    params.append('populate[questions]', '*');
    params.append('populate[course][fields][0]', 'id');
    params.append('populate[course][fields][1]', 'name');
    params.append('populate[subject][fields][0]', 'id');
    params.append('populate[subject][fields][1]', 'name');
    
    const response = await API.get(`/api/exams?${params.toString()}`);
    return response.data;
  },

  // Get exam attempts for an exam
  getExamAttempts: async (examId) => {
    const params = new URLSearchParams();
    params.append('filters[exam][id][$eq]', examId);
    params.append('populate[student][fields][0]', 'id');
    params.append('populate[student][fields][1]', 'username');
    params.append('populate[student][fields][2]', 'email');
    params.append('populate[exam][fields][0]', 'id');
    params.append('populate[exam][fields][1]', 'title');
    
    const response = await API.get(`/api/exam-attempts?${params.toString()}`);
    return response.data;
  }
};

export default examService;
