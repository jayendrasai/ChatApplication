import axios, { AxiosError, AxiosRequestConfig } from "axios";

// --- 🔐 Track refresh state and subscribers ---
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// --- ✅ Extend Axios config to allow _retry flag ---
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// --- 🚀 Create Axios instance ---
const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// --- 📦 Attach access token to every request ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {}; // 🛡 Ensure headers exist
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// --- 🔁 Handle token expiration and refresh ---
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalReq = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 403 && !originalReq._retry) {
      if (isRefreshing) {
        // 🕐 Refresh in progress – queue this request
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalReq.headers = originalReq.headers || {}; // 🛡 Ensure headers exist
            originalReq.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(api(originalReq)); // ✅ Retry original request
          });
        });
      }

      // 🆕 Start token refresh
      originalReq._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.get("/api/auth/refresh");

        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

        // 🔔 Notify all queued requests
        onRefreshed(newAccessToken);

        // 🔁 Retry original failed request
        originalReq.headers = originalReq.headers || {};
        originalReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalReq);
      } catch (refreshError) {
        // ❌ Refresh failed – log out
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;



// Imagine we have a dashboard page that needs to fetch data from three different API endpoints: /api/user, /api/products, and /api/notifications. All three requests are initiated at the same time.

// Scenario: Concurrent Calls with Expired Access Token
// Let's assume the user's access token has just expired.

// Call 1 (/api/user): The browser sends the first request with the expired token. The server immediately responds with a 403 Forbidden status.

// The response interceptor catches this error.

// It sees that isRefreshing is false, so it sets isRefreshing = true and proceeds to call the refresh endpoint: api.get('/api/auth/refresh'). This request to refresh the token is now in flight.

// Call 2 (/api/products): A few milliseconds later, this request is also sent with the expired token and fails with a 403.

// The response interceptor catches this error.

// It checks isRefreshing and sees that it is now true.

// Instead of initiating another refresh, it creates a new Promise and adds its resolve function to the refreshSubscribers queue. This request is now "on hold," waiting for the new token.

// Call 3 (/api/notifications): Almost simultaneously, this request fails with a 403.

// The response interceptor catches the error.

// It also sees that isRefreshing is true.

// It creates its own Promise and adds its resolve function to the refreshSubscribers queue.

// The Refresh and Retry Process
// The refresh call (/api/auth/refresh) from Call 1 successfully completes.

// The server returns a new accessToken.

// The interceptor stores this new token in localStorage.

// The interceptor then calls onRefreshed(newAccessToken).

// This function iterates through the refreshSubscribers queue.

// It resolves the Promise for Call 2, which then retries the original /api/products request with the new token.

// It resolves the Promise for Call 3, which then retries the original /api/notifications request with the new token.

// Finally, the initial promise for Call 1 is resolved, and its original /api/user request is also retried with the new token.

// All three API calls are now retried successfully, and the data is returned to the dashboard. The entire process happened seamlessly in the background, making it appear to the user as a single, successful page load. The key is that the token was refreshed only once, preventing a race condition and unnecessary load on the server.




