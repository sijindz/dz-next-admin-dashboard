import axios from 'axios';
import Cookies from 'js-cookie';
import { AppSettings } from './lib/app-settings';
const axiosInterceptorInstance = axios.create({
  baseURL: AppSettings.SERVICE_URL, // Replace with your API base URL
});


// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
        const accessToken = Cookies.get('_token');

    // If token is present add it to request's Authorization Header
   // console.log("interceptor")
    if (accessToken) {
        //console.log(config.headers)
      if (config.headers) config.headers.authorization = 'Bearer '+accessToken;
    }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);
// End of Request interceptor



// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    // Modify the response data here

    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptorInstance;