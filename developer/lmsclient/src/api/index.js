import axios from 'axios';

// 🔧 Safely get the runtime environment variable
const getEnvVar = (key, fallback) => {
  try {
    if (window._env_ && window._env_[key]) {
      console.log(`🌐 Using runtime ${key} from window._env_`);
      return window._env_[key];
    }
  } catch (e) {
    console.warn("window._env_ not found — falling back to process.env");
  }

  if (process.env[key]) {
    console.log(`🧩 Using build-time ${key} from process.env`);
    return process.env[key];
  }

  console.warn(`⚠️ ${key} not found — using fallback: ${fallback}`);
  return fallback;
};

// ✅ Resolve API URL priority: runtime > build > fallback
const API_URL = getEnvVar(
  "REACT_APP_API_URL",
  "http://localhost:1337"
);

// Log final resolved URL
console.log("✅ Final API URL:", API_URL);

// ✅ Create a reusable Axios instance
const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: add auth token if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor: handle global responses (like 401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🚫 Unauthorized! Redirecting to login...");
      // Optionally redirect or clear session here
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
