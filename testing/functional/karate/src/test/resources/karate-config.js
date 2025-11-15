function fn() {
  var config = {};
  // Base URL of your Flask API
  config.baseUrl = 'http://dev-els-lmsserver.local/api';

  // Default headers
  config.headers = { 'Content-Type': 'application/json' };

  return config;
}
