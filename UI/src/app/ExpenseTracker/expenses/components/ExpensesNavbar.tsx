import React, { useState, useEffect } from "react";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Button,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import { STORAGE_KEYS, ThemeMode } from "../../utils/CONSTANT";
import "./ExpensesNavbar.css";

interface ExpensesNavbarProps {
    onBack?: () => void;
    onThemeChange?: (theme: string) => void;
}

const ExpensesNavbar: React.FC<ExpensesNavbarProps> = ({
    onBack,
    onThemeChange,
}) => {
    const [currentTheme, setCurrentTheme] = useState<string>(ThemeMode.Light);

    useEffect(() => {
        const savedTheme =
            localStorage.getItem(STORAGE_KEYS.THEME) || ThemeMode.Light;
        setCurrentTheme(savedTheme);
    }, []);

    const handleThemeChange = (theme: string) => {
        setCurrentTheme(theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        document.documentElement.setAttribute("data-theme", theme);
        onThemeChange?.(theme);
    };

    const getThemeIcon = () => {
        switch (currentTheme) {
            case ThemeMode.Dark:
                return "🌙";
            case ThemeMode.Rose:
                return "🌹";
            default:
                return "☀️";
        }
    };

    return (
        <Navbar expand="md" className="expense-navbar">
            <NavbarBrand tag={Link} to="/" className="navbar-brand">
                <span className="brand-icon">💰</span>
                <span className="brand-text">Expense Tracker</span>
            </NavbarBrand>
            <Nav navbar className="ms-auto">
                {/* <NavItem> */}
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className="theme-toggle">
                        <span className="theme-icon">{getThemeIcon()}</span>
                        <span className="theme-label">Theme</span>
                    </DropdownToggle>
                    <DropdownMenu end>
                        <DropdownItem
                            onClick={() => handleThemeChange(ThemeMode.Light)}
                            active={currentTheme === ThemeMode.Light}
                            className="dropdown-item-custom"
                        >
                            ☀️ Light
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => handleThemeChange(ThemeMode.Dark)}
                            active={currentTheme === ThemeMode.Dark}
                            className="dropdown-item-custom"
                        >
                            🌙 Dark
                        </DropdownItem>
                        <DropdownItem
                            onClick={() => handleThemeChange(ThemeMode.Rose)}
                            active={currentTheme === ThemeMode.Rose}
                            className="dropdown-item-custom"
                        >
                            🌹 Rose
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                {/* </NavItem> */}
                {onBack && (
                    <NavItem className="ms-2">
                        <Button
                            color="secondary"
                            onClick={onBack}
                            size="sm"
                            className="back-button"
                        >
                            ← Back
                        </Button>
                    </NavItem>
                )}
            </Nav>
        </Navbar>
    );
};

export default ExpensesNavbar;
