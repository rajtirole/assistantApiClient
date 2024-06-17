import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true, // Send cookies with requests
});

export default apiClient;
