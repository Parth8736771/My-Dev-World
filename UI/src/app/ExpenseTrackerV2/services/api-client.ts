// // services/api.ts
// import type { AxiosRequestConfig, AxiosResponse } from "axios";
// import axios from "axios";
// import { API_GLOBAL_URL } from "../../../env";

// // const API_BASE_URL =
// //     process.env.REACT_APP_API_URL || "http://localhost:3001/api";
// const API_BASE_URL = API_GLOBAL_URL || "http://localhost:3001/api";

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Request Interceptor - Add auth token
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error),
// );

// // Response Interceptor - Handle errors globally
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     },
// );

// export default api;

// services/api-client.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { API_GLOBAL_URL } from "../../../env";
import type { CreateTransactionData, Transaction } from "../types/api";

const API_BASE_URL = API_GLOBAL_URL;
const TIMEOUT = 10000;
const MAX_RETRIES = 2;

// Types
export interface CreateApiEndpointOptions {
    baseURL?: string;
    headers?: Record<string, string>;
    timeout?: number;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

// export interface CreateTransactionData {
//     type: "Expense" | "Income" | "Saving" | "Investment";
//     amount: number;
//     category: string;
//     subcategory: string;
//     date: string;
// }

/**
 * Creates a configured Axios instance with global interceptors
 */
export const createApiEndpoint = (
    options: CreateApiEndpointOptions = {},
): AxiosInstance => {
    const instance = axios.create({
        baseURL: options.baseURL || API_BASE_URL,
        timeout: options.timeout || TIMEOUT,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // Request Interceptor - Enhanced with better error handling
    instance.interceptors.request.use(
        (config) => {
            try {
                const token = localStorage.getItem("authToken");
                if (token) {
                    config.headers!.Authorization = `Bearer ${token}`;
                }
                return config;
            } catch (error) {
                console.warn("Request interceptor error:", error);
                return config;
            }
        },
        (error) => Promise.reject(error),
    );

    // Response Interceptor - Production-ready error handling
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => {
            const originalRequest = error.config;

            // Handle 401 - Token expired/unauthorized
            if (error.response?.status === 401 && !originalRequest._retry) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");

                // Redirect to login only if not already on login page
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }

            // Handle 403 - Forbidden
            if (error.response?.status === 403) {
                alert("You don't have permission to perform this action");
            }

            // Retry logic for 5xx server errors (avoid infinite loops)
            if (
                error.response?.status >= 500 &&
                !originalRequest._retry &&
                MAX_RETRIES > 0
            ) {
                originalRequest._retry = true;
                await new Promise((resolve) =>
                    setTimeout(
                        resolve,
                        1000 * Math.pow(2, originalRequest._retryCount || 0),
                    ),
                );
                return instance(originalRequest);
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

/**
 * Generic typed endpoint factory - Production ready
 */
export const createEndpoint = <T, CreateDTO = T, UpdateDTO = Partial<T>>(
    resource: string,
) => {
    const api = createApiEndpoint();

    return {
        /**
         * Get all records with pagination support
         */
        getAll: (params?: {
            page?: number;
            limit?: number;
            search?: string;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
        }): Promise<{
            data: T[];
            total: number;
            page: number;
            limit: number;
        }> => {
            const queryParams = new URLSearchParams();
            if (params?.page)
                queryParams.append("page", params.page.toString());
            if (params?.limit)
                queryParams.append("limit", params.limit.toString());
            if (params?.search) queryParams.append("search", params.search);
            if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
            if (params?.sortOrder)
                queryParams.append("sortOrder", params.sortOrder);

            const url = queryParams.toString()
                ? `/${resource}?${queryParams.toString()}`
                : `/${resource}`;
            return api.get(url).then((res) => res.data);
        },

        /**
         * Get single record by ID
         */
        getById: (id: string | number): Promise<T> =>
            api.get(`/${resource}/${id}`).then((res) => res.data),

        /**
         * Create new record
         */
        create: (data: CreateDTO): Promise<T> =>
            api.post(`/${resource}`, data).then((res) => res.data),

        /**
         * Update existing record
         */
        update: (id: string | number, data: UpdateDTO): Promise<T> =>
            api.put(`/${resource}/${id}`, data).then((res) => res.data),

        /**
         * Patch partial update
         */
        patch: (id: string | number, data: Partial<UpdateDTO>): Promise<T> =>
            api.patch(`/${resource}/${id}`, data).then((res) => res.data),

        /**
         * Delete record
         */
        delete: (id: string | number): Promise<void> =>
            api.delete(`/${resource}/${id}`).then(() => void 0),

        /**
         * Bulk operations
         */
        bulkDelete: (ids: (string | number)[]): Promise<{ deleted: number }> =>
            api
                .post(`/${resource}/bulk-delete`, { ids })
                .then((res) => res.data),
    };
};

// Transaction-specific endpoint example
export const transactionsApi = createEndpoint<
    Transaction,
    CreateTransactionData
>("transactions");

// Export default for backward compatibility
export default createApiEndpoint;

// Usage
// // 1. Simple usage in components
// const transactions = await transactionsApi.getAll({ page: 1, limit: 50 });

// // 2. With custom base URL (microservices)
// const userApi = createEndpoint<User>('users', { baseURL: 'http://users-service/api' });

// // 3. Custom headers
// const uploadApi = createApiEndpoint({
//     headers: { 'Content-Type': 'multipart/form-data' }
// });

// // 4. In your Dashboard.tsx
// const loadTransactions = async () => {
//     try {
//         const response = await transactionsApi.getAll({ page: 1, limit: 100 });
//         setTransactions(response.data);
//     } catch (error: any) {
//         console.error('Failed to load transactions:', error.response?.data || error.message);
//     }
// };
