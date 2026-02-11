import axios from "axios";

export const BASE_URL = "http://localhost:5258/api";
// export const BASE_URL = "http://localhost:5258/api";
// export const BASE_URL = "https://localhost:7287/api";

// Add request interceptor to automatically add auth header
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.warn(token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Add response interceptor to handle 401
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalid or expired, redirect to login
            console.log("401: ");

            localStorage.removeItem("token");
            localStorage.removeItem("roles");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export const EndPointsName = {
    workspaces: "workspaces",
    projects: "projects",
    tasks: "tasks",
    questionCategories: "questioncategories",
    questionTags: "questiontags",
    questions: "questions",
    questionsByCategory: "questions/category",
    notes: "notes",
    expenses: "expenses",
    expensesNames: "expenses/names",
    authLogin: "auth/login",
    authRegister: "auth/register",
    learnings: "learnings",
};

// export const ExpenseType = {
//     Expense: "Expense",
//     Income: "Income",
// };

export const CreateAPIEndPoints = (endpoint: string) => {
    let url = BASE_URL + "/" + endpoint + "/";

    // Keep original axios methods for compatibility but add async wrappers
    return {
        fetchAll: () => axios.get(url),
        fetchById: (id: number) => axios.get(url + id),
        create: (newRecord: any) => axios.post(url, newRecord),
        update: (id: number, updatedRecord: any) =>
            axios.put(url + id, updatedRecord),
        delete: (id: number) => axios.delete(url + id),

        // Async helpers that return response.data or throw
        fetchAllAsync: async () => {
            const res = await axios.get(url);
            return res.data;
        },
        fetchByIdAsync: async (id: number) => {
            const res = await axios.get(url + id);
            return res.data;
        },
        createAsync: async (newRecord: any) => {
            const res = await axios.post(url, newRecord);
            return res.data;
        },
        updateAsync: async (id: number, updatedRecord: any) => {
            const res = await axios.put(url + id, updatedRecord);
            return res.data;
        },
        deleteAsync: async (id: number) => {
            const res = await axios.delete(url + id);
            return res.data;
        },
    };
};
