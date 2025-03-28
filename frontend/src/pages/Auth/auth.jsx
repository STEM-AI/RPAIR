import axios from 'axios';

const AUTH_TOKENS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
};

// Save tokens to localStorage
export const saveTokens = (tokens) => {
    localStorage.setItem(AUTH_TOKENS.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(AUTH_TOKENS.REFRESH_TOKEN, tokens.refresh_token);
};

// Get tokens from localStorage
export const getTokens = () => ({
    access_token: localStorage.getItem(AUTH_TOKENS.ACCESS_TOKEN),
    refresh_token: localStorage.getItem(AUTH_TOKENS.REFRESH_TOKEN),
});

// Clear tokens from localStorage
export const clearTokens = () => {
    localStorage.removeItem(AUTH_TOKENS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_TOKENS.REFRESH_TOKEN);
};

// Check if access token is expired
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= expirationTime;
    } catch (error) {
        return true;
    }
};

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
    try {
        const refresh_token = localStorage.getItem(AUTH_TOKENS.REFRESH_TOKEN);
        
        if (!refresh_token || isTokenExpired(refresh_token)) {
            // If refresh token is expired or doesn't exist, logout
            handleLogout();
            return null;
        }

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/token/refresh/`, {
            refresh: refresh_token
        });

        if (response.data.access) {
            localStorage.setItem(AUTH_TOKENS.ACCESS_TOKEN, response.data.access);
            return response.data.access;
        }
        
        return null;
    } catch (error) {
        handleLogout();
        return null;
    }
};

// Handle logout
export const handleLogout = () => {
    clearTokens();
    // Redirect to login page
    window.location.href = '/login';
};

// Create axios instance with interceptor
export const createAuthenticatedInstance = () => {
    const instance = axios.create();

    instance.interceptors.request.use(
        async (config) => {
            let access_token = localStorage.getItem(AUTH_TOKENS.ACCESS_TOKEN);

            if (access_token && isTokenExpired(access_token)) {
                // Token is expired, try to refresh it
                access_token = await refreshAccessToken();
            }

            if (access_token) {
                config.headers.Authorization = `Bearer ${access_token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

// Export authenticated axios instance
export const authAxios = createAuthenticatedInstance();
