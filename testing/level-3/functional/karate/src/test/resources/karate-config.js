function fn() {
  var config = {};
  // Base URL of your Flask API
  //config.baseUrl = 'http://dev-els-lmsserver.local/api';

  config.baseUrl = 'http://localhost:1337/api';

  // Default headers
  config.headers = { 'Content-Type': 'application/json' };

  return config;
}
