// src/front/js/layout.js

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/homePage";
import SmokerUser from "./pages/smokerUser";
import SignupSmoker from "./pages/signupSmoker";
import LoginSmoker from "./pages/loginSmoker"; 
import ControlPanelSmoker from "./pages/controlPanelSmoker";
import TiposConsumo from "./pages/tiposConsumo";
import CoachUser from "./pages/CoachUser"; 
import SignupCoach from "./pages/signupCoach";
import LoginCoach from "./pages/loginCoach"
import ControlPanelCoach from "./pages/controlPanelCoach";
import injectContext from "./store/appContext";
import FollowingList from "./pages/seguimiento";
import CoachProfile from "./pages/CoachProfile";

import Navbar from "./component/navbar"; 
import Footer from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const [theme, setTheme] = useState("dark"); // Cambia a "dark" como valor por defecto
    const [language, setLanguage] = useState("es");

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.className = newTheme; // Cambia la clase del body
    };

    // Cambia el fondo del body al cargar
    useEffect(() => {
        document.body.className = theme; // Aplica el tema al cargar
    }, [theme]);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar 
                        toggleTheme={toggleTheme} 
                        language={language} 
                        handleLanguageChange={handleLanguageChange} 
                        theme={theme} // Pasa el tema al Navbar
                    />
                    <Routes>
                        <Route element={<Home toggleTheme={toggleTheme} />} path="/" />
                        <Route element={<SmokerUser />} path="/smokeruser" />
                        <Route element={<SignupSmoker />} path="/signup-smoker" />
                        <Route element={<LoginSmoker />} path="/login-smoker" />
                        <Route element={<ControlPanelSmoker />} path="/control-panel-smoker" />
                        <Route element={<TiposConsumo />} path="/tiposconsumo" />
                        <Route element={<CoachUser />} path="/coaches" />
                        <Route element={<SignupCoach />} path="/signup-coach" />
                        <Route element={<LoginCoach />} path="/login-coach" />
                        <Route element={<ControlPanelCoach />} path="/control-panel-coach" />
                        <Route element={<FollowingList />} path="/seguimiento" />
                        <Route element={<CoachProfile />} path="/coach-profile" />
                        
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
