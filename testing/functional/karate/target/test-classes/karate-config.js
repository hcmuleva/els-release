function fn() {
  var config = {};
  // Base URL of your Flask API
  config.baseUrl = 'http://192.168.18.47:1337/api';

  // Default headers
  config.headers = { 'Content-Type': 'application/json' };

  return config;
}
