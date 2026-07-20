const axios = require('axios');

const client = axios.create({
    baseURL: process.env.AUTH_SERVICE_URL,
    timeout: 5000, 
});

const getUser = async(targetUserId, callerUser) => {
    try {
        const {data} = await client.get(`/api/auth/internal/users/${targetUserId}`, {
            headers: { 
                'x-user-id': String(callerUser.id),
                'x-user-role': callerUser.role,
                'x-internal-api-key': process.env.INTERNAL_API_KEY,

            },
        });
        return data;
    } catch (err) {
            if (err.response?.status === 404) return null;
            throw new Error(`Auth Service unreachable: ${err.message}`);
    }
}

module.exports = {getUser};