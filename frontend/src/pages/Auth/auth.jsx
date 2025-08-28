import axios from "axios";

const AUTH_TOKENS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

// Save tokens to localStorage
export const saveTokens = (tokens) => {
  try {
    localStorage.setItem(AUTH_TOKENS.ACCESS_TOKEN, tokens.access_token);
    localStorage.setItem(AUTH_TOKENS.REFRESH_TOKEN, tokens.refresh_token);
    console.log("Tokens saved successfully");
  } catch (error) {
    console.error("Error saving tokens to localStorage:", error);
  }
};

// Get tokens from localStorage
export const getTokens = () => ({
  access_token: localStorage.getItem(AUTH_TOKENS.ACCESS_TOKEN),
  refresh_token: localStorage.getItem(AUTH_TOKENS.REFRESH_TOKEN),
});

// Clear tokens from localStorage
export const clearTokens = () => {
  try {
    localStorage.removeItem(AUTH_TOKENS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_TOKENS.REFRESH_TOKEN);
    localStorage.removeItem("user_role");
    console.log("Tokens cleared successfully");
  } catch (error) {
    console.error("Error clearing tokens from localStorage:", error);
  }
};

// Extract token information including expiration time
export const getTokenInfo = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now();
    const expirationTime = payload.exp * 1000;

    return {
      payload,
      expirationTime,
      issuedAt: payload.iat * 1000,
      expiresIn: expirationTime - currentTime,
      userId: payload.user_id,
      username: payload.username,
      isStaff: payload.is_staff,
      isSuperuser: payload.is_superuser,
      organization: payload.organization,
      isExpired: currentTime >= expirationTime,
      willExpireSoon: expirationTime - currentTime < 300000, // 5 minutes
    };
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

// Check if token is expired with safety margin
export const isTokenExpired = (token, safetyMargin = 30000) => {
  const tokenInfo = getTokenInfo(token);
  if (!tokenInfo) return true;

  return tokenInfo.isExpired || tokenInfo.willExpireSoon;
};

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
  try {
    const refresh_token = localStorage.getItem(AUTH_TOKENS.REFRESH_TOKEN);

    if (!refresh_token) {
      console.error("No refresh token found");
      handleLogout();
      return null;
    }

    // Check if refresh token is expired
    const refreshTokenInfo = getTokenInfo(refresh_token);
    if (!refreshTokenInfo || refreshTokenInfo.isExpired) {
      console.error("Refresh token has expired or is invalid");
      handleLogout();
      return null;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/token/refresh/`,
      {
        refresh: refresh_token,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.access) {
      saveTokens({
        access_token: response.data.access,
        refresh_token: response.data.refresh || refresh_token, // Keep old refresh if new one not provided
      });

      console.log("Token refreshed successfully");
      return response.data.access;
    } else {
      console.error("Refresh token endpoint did not return new access token");
      handleLogout();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);

    if (error.code === "ECONNABORTED") {
      console.error("Token refresh request timed out");
      // Don't logout for timeout, let the request continue with old token
      return null;
    }

    if (error.response) {
      if (error.response.status === 401) {
        console.error("Invalid refresh token - unauthorized");
        handleLogout();
      } else if (error.response.status >= 500) {
        console.error("Server error during token refresh");
        // Don't logout for server errors
        return null;
      }
    } else if (error.request) {
      console.error(
        "Network error during token refresh - no response received",
      );
      // Don't logout for network errors
      return null;
    }

    handleLogout();
    return null;
  }
};

// Handle logout
export const handleLogout = (
  message = "Performing logout due to token expiration or invalid refresh token",
) => {
  console.log(message);
  clearTokens();
  // Redirect to login page
  window.location.href = "/login";
};

// Periodic token check function
export const startTokenMonitor = (checkInterval = 60000) => {
  let monitorInterval = null;

  const checkTokens = () => {
    const { access_token, refresh_token } = getTokens();

    if (!access_token || !refresh_token) {
      console.log("No tokens found, stopping monitor");
      if (monitorInterval) clearInterval(monitorInterval);
      return;
    }

    const accessTokenInfo = getTokenInfo(access_token);
    const refreshTokenInfo = getTokenInfo(refresh_token);

    if (!refreshTokenInfo || refreshTokenInfo.isExpired) {
      console.log("Refresh token expired, logging out");
      handleLogout("Refresh token expired");
      return;
    }

    if (accessTokenInfo && accessTokenInfo.willExpireSoon) {
      console.log("Access token will expire soon, refreshing...");
      refreshAccessToken().catch((error) => {
        console.error("Background token refresh failed:", error);
      });
    }
  };

  // Run immediately and then set interval
  checkTokens();
  monitorInterval = setInterval(checkTokens, checkInterval);

  return monitorInterval;
};

// Initialize token monitoring
export const initializeTokenMonitoring = () => {
  const { access_token, refresh_token } = getTokens();

  if (access_token && refresh_token) {
    console.log("Starting token monitoring");
    return startTokenMonitor(30000); // Check every 30 seconds
  }

  console.log("No valid tokens found for monitoring");
  return null;
};

// Create axios instance with improved interceptor
export const createAuthenticatedInstance = () => {
  const instance = axios.create();
  let isRefreshing = false;
  let refreshSubscribers = [];

  const onRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
  };

  const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
  };

  instance.interceptors.request.use(
    async (config) => {
      const access_token = localStorage.getItem(AUTH_TOKENS.ACCESS_TOKEN);

      if (!access_token) {
        console.log("No access token found for request");
        return config;
      }

      const tokenInfo = getTokenInfo(access_token);

      // If token will expire in less than 30 seconds, refresh it
      if (tokenInfo && tokenInfo.willExpireSoon) {
        console.log("Access token will expire soon, attempting to refresh");

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const newToken = await refreshAccessToken();
            isRefreshing = false;

            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
              onRefreshed(newToken);
            } else {
              // If refresh fails but we have a token, continue with it
              config.headers.Authorization = `Bearer ${access_token}`;
            }
          } catch (error) {
            isRefreshing = false;
            console.error("Error in refresh process:", error);
            config.headers.Authorization = `Bearer ${access_token}`;
          }
        } else {
          // If refresh is already in progress, wait for it to complete
          return new Promise((resolve) => {
            addRefreshSubscriber((newToken) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(config);
            });
          });
        }
      } else {
        config.headers.Authorization = `Bearer ${access_token}`;
      }

      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    },
  );

  // Add response interceptor to handle auth errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized access - redirecting to login");
        handleLogout("Unauthorized access detected");
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// Export authenticated axios instance
export const authAxios = createAuthenticatedInstance();

// Utility function to check authentication status
export const isAuthenticated = () => {
  const { access_token, refresh_token } = getTokens();

  if (!access_token || !refresh_token) return false;

  const accessInfo = getTokenInfo(access_token);
  const refreshInfo = getTokenInfo(refresh_token);

  return !!(accessInfo && refreshInfo && !refreshInfo.isExpired);
};

// Utility function to get user info from token
export const getUserInfo = () => {
  const { access_token } = getTokens();
  if (!access_token) return null;

  const tokenInfo = getTokenInfo(access_token);
  if (!tokenInfo) return null;

  return {
    userId: tokenInfo.userId,
    username: tokenInfo.username,
    isStaff: tokenInfo.isStaff,
    isSuperuser: tokenInfo.isSuperuser,
    organization: tokenInfo.organization,
  };
};
