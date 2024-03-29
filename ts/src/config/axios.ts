// eslint-disable-next-line @typescript-eslint/no-explicit-any
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import Swal from 'sweetalert2'
export const BASE_URL: string = 'http://localhost:3000/';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

const onRequest = (config: AxiosRequestConfig) => {
  let jwtToken = localStorage.getItem("token");
  if (!jwtToken || jwtToken == null) {
    jwtToken = localStorage.getItem("adminToken");
  }
  config.headers = config.headers || {};
  config.headers['authorization'] = `Bearer ${jwtToken}`;
  return config;
};

axiosInstance.interceptors.request.use(onRequest);

export const get = async <T>(url: string, _type?: string): Promise<T> => {
  try {
    const response: AxiosResponse = await axiosInstance.get(url);
    console.log("repones axios", response)
    return response.data
  } catch (error) {
    console.log(error);

    handleRequestError(error);
    throw error;
  }
};

export const post = async <T>(url: string, data?: any): Promise<T> => {
  try {
    console.log(url, data);

    url = data.type + url;
    const response: AxiosResponse = await axiosInstance.post(url, data);
    console.log(response, "axios post response");
    return response.data;
  } catch (error) {
    console.log(error);
    // handleRequestError(error);
    throw error;
  }
};

const handleRequestError = (error: AxiosError): void => {
  console.error('Request error:', error.message || 'Unknown error');
};

interface resolve {
  data: AxiosResponse | null,
  error: AxiosError | null
}
export async function resolve(promise: Promise<any> | PromiseLike<null> | null) {
  const resolved: resolve = {
    data: null,
    error: null
  };
  try {
    resolved.data = await promise;
  } catch (e) {
    resolved.error = e;
  }
  if (resolved?.error?.response?.data?.isBlocked) {
    Swal.fire({
      title: "You're blocked!",
      text: "You are blocked by the admin.",
      icon: "warning"
    }).then((_res) => {
      localStorage.clear()
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    });
  } else {
    return resolved;
  }

}

export default axiosInstance;