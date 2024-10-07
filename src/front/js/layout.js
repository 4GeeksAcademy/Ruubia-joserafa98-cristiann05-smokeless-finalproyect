import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/homePage";
import SignupSmoker from "./pages/signupSmoker";
import LoginSmoker from "./pages/loginSmoker"; 
import ControlPanelSmoker from "./pages/controlPanelSmoker";
import SignupCoach from "./pages/signupCoach";
import LoginCoach from "./pages/loginCoach";
import ControlPanelCoach from "./pages/controlPanelCoach";
import injectContext from "./store/appContext";
import CreateProfileUser from "./pages/createProfile-user";
import CreateConsumProfile from "./pages/ConfiguracionConsumo";
import SmokerMapPage from "./pages/SmokerMapPage";
import CoachMapPage from "./pages/CoachMapPage";
import CreateProfileCoach from "./pages/createProfile-coach";
import LoginSelection from "./pages/LoginSelection";
import SolicitudesCoach from "./component/SolicitudesCoach";
import ViewProfileCoach from "./pages/ViewProfileCoach";


import Navbar from "./component/navbar"; 
import Footer from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const [theme, setTheme] = useState("dark");
    const [language, setLanguage] = useState("es");

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.className = newTheme;
    };

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    // Rutas donde no queremos mostrar el Navbar
    const hiddenRoutes = ['/control-panel-coach', '/control-panel-smoker'];

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    {/* Renderiza el Navbar solo si la ruta no está en hiddenRoutes */}
                    {!hiddenRoutes.includes(window.location.pathname) && (
                        <Navbar 
                            toggleTheme={toggleTheme} 
                            language={language} 
                            handleLanguageChange={handleLanguageChange} 
                            theme={theme} 
                        />
                    )}
                    <Routes>
                        <Route element={<Home toggleTheme={toggleTheme} />} path="/" />
                        <Route element={<SignupSmoker />} path="/signup-smoker" />
                        <Route element={<LoginSmoker />} path="/login-smoker" />
                        <Route element={<ControlPanelSmoker />} path="/control-panel-smoker" />
                        <Route element={<SignupCoach />} path="/signup-coach" />
                        <Route element={<LoginCoach />} path="/login-coach" />
                        <Route element={<ControlPanelCoach />} path="/control-panel-coach" />
                        <Route element={<SolicitudesCoach />} path="/track-client" />
                        <Route element={<CreateProfileUser />} path="/question-profile-smoker" />
                        <Route element={<CreateConsumProfile />} path="/question-config-smoker" />
                        <Route element={<CreateProfileCoach />} path="/question-profile-coach" />
                        <Route element={<CoachMapPage />} path="/control-panel-coach/map" />
                        <Route element={<SmokerMapPage />} path="/control-panel-smoker/map" />
                        <Route element={<LoginSelection />} path="/login-selection" />
                        <Route element={<ViewProfileCoach />} path="/coach-details/:coachId" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
