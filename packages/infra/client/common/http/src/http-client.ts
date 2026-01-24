import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface HttpClientError {
  message: string;
  code?: string;
  statusCode?: number;
  i18nKey?: string;
}

export interface HttpClientConfig {
  baseUrl: string;
  withCredentials?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private bearerToken?: string;

  constructor(config: string | HttpClientConfig) {
    const clientConfig = typeof config === 'string' 
      ? { baseUrl: config }
      : config;

    this.axiosInstance = axios.create({
      baseURL: clientConfig.baseUrl,
      withCredentials: clientConfig.withCredentials ?? true, // Enable cookies by default
      timeout: clientConfig.timeout ?? 30000, // 30 seconds default
      headers: {
        'Content-Type': 'application/json',
        ...clientConfig.headers,
      },
    });

    // Add request interceptor for Bearer token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.bearerToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.bearerToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Set Bearer token for authentication
   */
  setBearerToken(token: string): void {
    this.bearerToken = token;
  }

  /**
   * Clear Bearer token
   */
  clearBearerToken(): void {
    this.bearerToken = undefined;
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  private handleError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as HttpClientError;
      
      return new Error(JSON.stringify({
        i18nKey: errorData?.i18nKey || 'server_error',
        message: errorData?.message || error.message,
        code: errorData?.code,
        statusCode: error.response.status,
      } as HttpClientError));
    } else if (error.request) {
      // Request made but no response received
      return new Error(JSON.stringify({
        i18nKey: 'network_error',
        message: 'No response from server',
        statusCode: 0,
      } as HttpClientError));
    } else {
      // Something else happened
      return new Error(JSON.stringify({
        i18nKey: 'network_error',
        message: error.message || 'Request failed',
        statusCode: 0,
      } as HttpClientError));
    }
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    return response.data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint);
    return response.data;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data);
    return response.data;
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }
}
