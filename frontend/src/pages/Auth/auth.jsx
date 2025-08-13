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
        
        if (!refresh_token) {
            console.error('No refresh token found');
            handleLogout();
            return null;
        }

        if (isTokenExpired(refresh_token)) {
            console.error('Refresh token has expired');
            handleLogout();
            return null;
        }

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/token/refresh/`, {
            refresh: refresh_token
        });

        if (response.data.access) {
            localStorage.setItem(AUTH_TOKENS.ACCESS_TOKEN, response.data.access);
            localStorage.setItem(AUTH_TOKENS.REFRESH_TOKEN, response.data.refresh);
            return response.data.access;
        } else {
            console.error('Refresh token endpoint did not return new tokens');
            handleLogout();
            return null;
        }
        
    } catch (error) {
        console.error('Error refreshing token:', error);
        if (error.response && error.response.status === 401) {
            console.error('Invalid refresh token');
        }
        handleLogout();
        return null;
    }
};

// Handle logout
export const handleLogout = () => {
    console.log('Performing logout due to token expiration or invalid refresh token');
    clearTokens();
    // Redirect to login page
    window.location.href = '/login';
};

// Create axios instance with interceptor
export const createAuthenticatedInstance = () => {
    const instance = axios.create();

    instance.interceptors.request.use(
        async (config) => {
            const access_token = localStorage.getItem(AUTH_TOKENS.ACCESS_TOKEN);

            if (!access_token) {
                console.log('No access token found');
                return config;
            }

            if (isTokenExpired(access_token)) {
                console.log('Access token expired, attempting to refresh');
                const newToken = await refreshAccessToken();
                if (newToken) {
                    config.headers.Authorization = `Bearer ${newToken}`;
                }
            } else {
                config.headers.Authorization = `Bearer ${access_token}`;
            }

            return config;
        },
        (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
        }
    );

    return instance;
};

// Export authenticated axios instance
export const authAxios = createAuthenticatedInstance();