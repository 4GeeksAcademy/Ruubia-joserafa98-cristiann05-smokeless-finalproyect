import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/homePage";
import SignupSmoker from "./pages/signupSmoker";
import LoginSmoker from "./pages/loginSmoker"; 
import DashboardSmoker from "./pages/dashboardSmoker";
import SignupCoach from "./pages/signupCoach";
import LoginCoach from "./pages/loginCoach";
import ControlPanelCoach from "./pages/dashboardCoach";
import injectContext from "./store/appContext";
import CreateProfileUser from "./pages/createProfileSmoker";
import CreateConsumProfile from "./pages/createConfigProfileSmoker";
import SmokerMapPage from "./pages/SmokerMapPage";
import CoachMapPage from "./pages/coachMapPage";
import CreateProfileCoach from "./pages/createProfileCoach";
import LoginSelection from "./pages/loginSelection";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    // Verifica la URL del backend
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<SignupSmoker />} path="/signup-smoker" />
                        <Route element={<LoginSmoker />} path="/login-smoker" />
                        <Route element={<DashboardSmoker />} path="/dashboard-smoker" />
                        <Route element={<SignupCoach />} path="/signup-coach" />
                        <Route element={<LoginCoach />} path="/login-coach" />
                        <Route element={<ControlPanelCoach />} path="/control-panel-coach" />
                        <Route element={<CreateProfileUser />} path="/question-profile-smoker" />
                        <Route element={<CreateConsumProfile />} path="/question-config-smoker" />
                        <Route element={<CreateProfileCoach />} path="/question-profile-coach" />
                        <Route element={<CoachMapPage />} path="/control-panel-coach/map" />
                        <Route element={<SmokerMapPage />} path="/control-panel-smoker/map" />
                        <Route element={<LoginSelection />} path="/login-selection" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
