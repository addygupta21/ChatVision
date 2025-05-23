import axios from 'axios'

export const axiosClient = axios.create({
    baseURL: "http://localhost:4001",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosClient.interceptors.request.use(
    (request) => {
        console.log('Making request to:', request.url, 'with data:', request.data);
        const accessToken = localStorage.getItem("KEY_ACCESS_TOKEN");
        if (accessToken) {
            request.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return request;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.data);
        return response;
    },
    (error) => {
        console.error('Response error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        // Only redirect to login if it's an authentication error (401)
        if (error.response?.status === 401) {
            window.location.replace('/login');
        }
        
        return Promise.reject(error);
    }
);