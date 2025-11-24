import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    stages: [
        { duration: '10s', target: 1 }, // Ramp up to 1 user
        { duration: '10s', target: 1 }, // Stay at 1 user
        { duration: '5s', target: 0 }, // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'], // Less than 1% failure
    },
};

const BASE_URL = 'http://els-api.local/api';

export default function () {
    const uuid = uuidv4();
    const username = `user_${uuid}`;
    const email = `testuser_${uuid}@hph.com`;
    const password = 'Welcome@123';

    // 1. Register
    const registerPayload = JSON.stringify({
        username: username,
        email: email,
        password: password,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const registerRes = http.post(`${BASE_URL}/auth/local/register`, registerPayload, params);

    check(registerRes, {
        'registered successfully': (r) => r.status === 200,
        'register has jwt': (r) => r.json('jwt') !== undefined,
    });

    if (registerRes.status !== 200) {
        console.log(`Registration failed: ${registerRes.body}`);
        return;
    }

    // 2. Login
    const loginPayload = JSON.stringify({
        identifier: email,
        password: password,
    });

    // Small delay to ensure persistence (though usually not needed)
    sleep(2);

    const loginRes = http.post(`${BASE_URL}/auth/local`, loginPayload, params);

    check(loginRes, {
        'logged in successfully': (r) => r.status === 200,
        'login has jwt': (r) => r.json('jwt') !== undefined,
    });

    if (loginRes.status !== 200) {
        console.log(`Login failed for ${email}: ${loginRes.status} - ${loginRes.body}`);
    }

    sleep(1);
}
