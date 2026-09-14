const autocannon = require('autocannon');

async function runTest(name, opts) {
    console.log(`--Running: ${name}--`);
    const result = await autocannon(opts);
    console.log(autocannon.printResult(result));
    return result;
}

(async () => {
    await runTest('Register', {
        url: 'http://localhost:4000/api/auth/register',
        connections: 20,
        duration: 15,
        method: 'POST',
        headers: {'content-type': 'application/json'},
        setupClient: (client) => {
            client.setBody(JSON.stringify({
                name: 'Load Test User',
                email: `loadtest_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`,
                password: 'Password123!'
            }));
        }
    });

    await runTest('Login', {
        url: 'http://localhost:4000/api/auth/login',
        connections: 20,
        method: 'POST',
        headers: {'content-type': 'application/json' },
        body: JSON.stringify({
            email: 'seeduser@test.com',
            password: 'Password123!',
        })
    });

    await runTest('Admin Login', {
        url: 'http://localhost:4000/api/auth/admin/l0gin',
        connections: 20,
        duration: 15,
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            email: 'admin@test.com',
            password: 'AdminPass123!'
        })
    });

    await runTest('Admin Register', {
        url: 'http://localhost:4000/api/auth/admin/register',
        connections: 10,
        duration: 15,
        method: 'POST',
        headers: {'content-type': 'application/json'},
        setupClient: (client) => {
            client.setBody(JSON.stringify({
                name: 'Load Test Admin',
                email: `loadtestadmin_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`,
                password: 'AdminPass123!'
            }));
        }
    });

    await runTest('Refresh Token', {
        url: 'http://localhost:4000/api/auth/refresh',
        connections: 30,
        duration: 15,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'cookie': 'refreshToken = ${process.env.TEST_REFRESH_TOKEN}'
        }
    });
})();