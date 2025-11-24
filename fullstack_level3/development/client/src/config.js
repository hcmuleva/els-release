// Runtime configuration helper
// Reads from window._env_ injected by env.sh at runtime,
// or falls back to import.meta.env for local development.

export const getEnv = (key) => {
    const runtimeValue = window._env_ && window._env_[key];
    return runtimeValue || import.meta.env[key] || '';
};

export const API_URL = getEnv('VITE_API_URL');
