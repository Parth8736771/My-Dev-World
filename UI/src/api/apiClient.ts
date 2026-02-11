import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { API_GLOBAL_URL } from "../env";
//localhost:7287
// const API_BASE_URL = "http://localhost:5258/api";
// const API_BASE_URL = "http://localhost:5258/api";
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = API_GLOBAL_URL;

interface CreateApiEndpointOptions {
    baseURL?: string;
    headers?: Record<string, string>;
}

/**
 * Creates an API endpoint instance with optional authentication support
 * @param options - Configuration options
 * @returns Configured axios instance
 */
export const createApiEndpoint = (
    options: CreateApiEndpointOptions = {},
): AxiosInstance => {
    const instance = axios.create({
        baseURL: options.baseURL || API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // Add token to requests automatically
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    // Handle response errors
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // If 401, user is not authenticated
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        },
    );

    return instance;
};

/**
 * Create a specific endpoint with operations (GET, POST, PUT, DELETE)
 */
export const createEndpoint = <T>(resource: string) => {
    const api = createApiEndpoint();

    return {
        getAll: (): Promise<T[]> =>
            api.get<T[]>(`/${resource}`).then((res) => res.data),

        getById: (id: string | number): Promise<T> =>
            api.get<T>(`/${resource}/${id}`).then((res) => res.data),

        create: (data: T): Promise<T> =>
            api.post<T>(`/${resource}`, data).then((res) => res.data),

        update: (id: string | number, data: Partial<T>): Promise<T> =>
            api.put<T>(`/${resource}/${id}`, data).then((res) => res.data),

        delete: (id: string | number): Promise<void> =>
            api.delete(`/${resource}/${id}`).then(() => {}),
    };
};

export default createApiEndpoint;

// import axios from "axios";
// import { API_GLOBAL_URL } from "../env";

// export const BASE_URL = API_GLOBAL_URL;

// // Add request interceptor to automatically add auth header
// axios.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("token");
//         console.warn(token);

//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     },
// );

// // Add response interceptor to handle 401
// axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response && error.response.status === 401) {
//             // Token invalid or expired, redirect to login
//             console.log("401: ");

//             localStorage.removeItem("token");
//             localStorage.removeItem("roles");
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     },
// );

// export const EndPointsName = {
//     workspaces: "workspaces",
//     projects: "projects",
//     tasks: "tasks",
//     questionCategories: "questioncategories",
//     questionTags: "questiontags",
//     questions: "questions",
//     questionsByCategory: "questions/category",
//     notes: "notes",
//     expenses: "expenses",
//     expensesNames: "expenses/names",
//     authLogin: "auth/login",
//     authRegister: "auth/register",
//     learnings: "learnings",
// };

// // export const ExpenseType = {
// //     Expense: "Expense",
// //     Income: "Income",
// // };

// export const CreateAPIEndPoints = (endpoint: string) => {
//     let url = BASE_URL + "/" + endpoint + "/";

//     // Keep original axios methods for compatibility but add async wrappers
//     return {
//         fetchAll: () => axios.get(url),
//         fetchById: (id: number) => axios.get(url + id),
//         create: (newRecord: any) => axios.post(url, newRecord),
//         update: (id: number, updatedRecord: any) =>
//             axios.put(url + id, updatedRecord),
//         delete: (id: number) => axios.delete(url + id),

//         // Async helpers that return response.data or throw
//         fetchAllAsync: async () => {
//             const res = await axios.get(url);
//             return res.data;
//         },
//         fetchByIdAsync: async (id: number) => {
//             const res = await axios.get(url + id);
//             return res.data;
//         },
//         createAsync: async (newRecord: any) => {
//             const res = await axios.post(url, newRecord);
//             return res.data;
//         },
//         updateAsync: async (id: number, updatedRecord: any) => {
//             const res = await axios.put(url + id, updatedRecord);
//             return res.data;
//         },
//         deleteAsync: async (id: number) => {
//             const res = await axios.delete(url + id);
//             return res.data;
//         },
//     };
// };
