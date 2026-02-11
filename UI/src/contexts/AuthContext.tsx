import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
// import { CreateAPIEndPoints, EndPointsName } from "../api/apiClient";
import { useNavigate } from "react-router-dom";
// import { CreateAPIEndPoints, EndPointsName } from "../api/apiClient";

export interface User {
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) => Promise<void>;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const navigate = useNavigate();

    // Load token and user from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        debugger;
        try {
            const response = await fetch(
                "http://localhost:5258/api/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }

            debugger;
            const data = await response.json();
            const userData: User = {
                email: data.email || email,
                firstName: data.firstName || email.split("@")[0],
                lastName: data.lastName || "",
                roles: data.roles || ["User"],
            };

            setToken(data?.token);
            setUser(userData);

            // Save to localStorage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("authUser", JSON.stringify(userData));

            /// POST - /api/auth/login
            // await CreateAPIEndPoints(EndPointsName.authLogin)
            //     .create({
            //         email,
            //         password,
            //     })
            //     .then((data): void => {
            //         debugger;
            //         if (!data) {
            //             // const errorData = await response.json();
            //             throw new Error(data || "Login failed");
            //         }
            //         console.log(data, " start!");
            //         // const data = response; //response.json();
            //         const userData: User = {
            //             email: data.email || email,
            //             firstName: data.firstName || email.split("@")[0],
            //             lastName: data.lastName || "",
            //             roles: data.roles || ["User"],
            //         };

            //         setToken(data?.token);
            //         setUser(userData);

            //         // Save to localStorage
            //         localStorage.setItem("authToken", data.token);
            //         localStorage.setItem("authUser", JSON.stringify(userData));
            //         console.log(userData, " done!");
            //         // navigate("/");
            //     })
            //     .catch((err) => {
            //         console.error(err);
            //     });
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ) => {
        try {
            const response = await fetch(
                "http://localhost:5258/api/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email,
                        password,
                        firstName,
                        lastName,
                        role: "User",
                    }),
                },
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }

            debugger;
            const data = await response.json();
            const userData: User = {
                email,
                firstName,
                lastName,
                roles: ["User"],
            };

            setToken(data.token);
            setUser(userData);

            // Save to localStorage
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("authUser", JSON.stringify(userData));
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    };

    const hasRole = (role: string): boolean => {
        return user?.roles.includes(role) ?? false;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
function CreateEndPoints(authLogin: any) {
    throw new Error("Function not implemented.");
}
