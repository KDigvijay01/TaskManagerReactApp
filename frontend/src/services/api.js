import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

client.setToken = (token) => {
  if (token) client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete client.defaults.headers.common['Authorization'];
};

export default client;
