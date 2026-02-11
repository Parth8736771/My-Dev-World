import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

/* ---------------- Types ---------------- */

export type ThemeMode = "light" | "dark";

interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

/* ---------------- Context ---------------- */

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/* ---------------- Provider ---------------- */

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeMode>("light");

    /* Load theme from localStorage or system preference */
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeMode | null;

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)",
            ).matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    /* Apply theme to <html> */
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/* ---------------- Hook ---------------- */

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
