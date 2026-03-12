const axios = require('axios');
require('dotenv').config();

async function testHttpRoute() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@quickbite.com',
            password: 'admin' // assuming default admin password
        });

        const token = loginRes.data.token;
        console.log("Got token:", token.substring(0, 10) + "...");

        const res = await axios.put('http://localhost:5000/api/admin/settings', {
            canteenName: 'Tested Canteen',
            isOpen: false
        }, {
            headers: { 'x-auth-token': token }
        });

        console.log("Settings successfully updated via HTTP:", res.data);
    } catch (err) {
        console.error("HTTP error:", err.response ? err.response.data : err.message);
    }
}
testHttpRoute();
