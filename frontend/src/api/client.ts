import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    console.log('=== API Request Start ===');
    console.log('URL:', `${config.baseURL}${config.url}`);
    console.log('Method:', config.method);
    console.log('Data:', config.data);
    console.log('Headers:', config.headers);
    console.log('=== API Request End ===');
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('=== API Request Error ===');
    console.error(error);
    console.error('=== API Request Error End ===');
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    console.log('=== API Response Start ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('=== API Response End ===');
    return response;
  },
  async (error) => {
    console.error('=== API Response Error Start ===');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('=== API Response Error End ===');

    // 네트워크 에러인 경우
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('서버에 연결할 수 없습니다.'));
    }

    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return client(originalRequest);
      } catch (error) {
        // If refresh token fails, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default client; 