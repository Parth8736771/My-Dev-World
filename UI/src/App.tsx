import "./App.css";
import Header from "./app/app-1/components/Header/header";
import Layout from "./app/app-1/Layout/layout";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
    // document.documentElement.setAttribute("data-theme", "dark");
    return (
        <Layout>
            <AppRoutes />
        </Layout>
    );
}

export default App;
