import axios from 'axios';

// baseURL: 'http://localhost:5000',
const apiClient = axios.create({
    baseURL: 'https://assistantapiserver.onrender.com',
  withCredentials: true, // Send cookies with requests
  withCookies: true,
});

export default apiClient;
