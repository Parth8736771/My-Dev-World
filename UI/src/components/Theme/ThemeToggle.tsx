import { useTheme } from "../../ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button className="btn btn-primary btn-theme" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
    );
};

export default ThemeToggle;
