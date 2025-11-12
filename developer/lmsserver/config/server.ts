export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'), 

  app: {
    keys: env.array('APP_KEYS'),
  },
  allowedHosts: env.array('ALLOWED_HOSTS', [
    'localhost',
    '127.0.0.1',
    'els-lmsserver.local',
    'elslms.local',
    'els-lms-api.local',
    'els-lms-ui.local',
  ]),
});
