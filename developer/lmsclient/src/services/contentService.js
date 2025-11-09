import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const contentService = {
  // Get all contents with optional filters
  getAllContents: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/contents`, {
        ...getAuthHeader(),
        params: {
          populate: '*',
          ...params
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch contents');
    }
  },

  // Get content by documentId
  getContentById: async (documentId) => {
    try {
      const response = await axios.get(`${API_URL}/contents/${documentId}?populate=*`, getAuthHeader());
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch content');
    }
  },

  // Get contents by subject
  getContentsBySubject: async (subjectId) => {
    try {
      const response = await axios.get(`${API_URL}/contents`, {
        ...getAuthHeader(),
        params: {
          'filters[subject][id][$eq]': subjectId,
          populate: '*'
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch subject contents');
    }
  },

  // Get contents by teacher
  getContentsByTeacher: async (teacherId) => {
    try {
      const response = await axios.get(`${API_URL}/contents`, {
        ...getAuthHeader(),
        params: {
          'filters[teacher][id][$eq]': teacherId,
          populate: '*'
        }
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch teacher contents');
    }
  },

  // Create new content
  createContent: async (contentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/contents`,
        { data: contentData },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to create content');
    }
  },

  // Update content by documentId
  updateContent: async (documentId, contentData) => {
    try {
      const response = await axios.put(
        `${API_URL}/contents/${documentId}`,
        { data: contentData },
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to update content');
    }
  },

  // Delete content by documentId
  deleteContent: async (documentId) => {
    try {
      await axios.delete(`${API_URL}/contents/${documentId}`, getAuthHeader());
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete content');
    }
  },

  // Upload content attachment/media
  uploadMedia: async (files) => {
    try {
      const formData = new FormData();
      
      if (Array.isArray(files)) {
        files.forEach(file => formData.append('files', file));
      } else {
        formData.append('files', files);
      }

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error?.message || 'Failed to upload media');
    }
  }
};

export default contentService;
