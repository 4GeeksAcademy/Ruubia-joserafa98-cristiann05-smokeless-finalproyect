import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/homePage";
import SignupSmoker from "./pages/signupSmoker";
import LoginSmoker from "./pages/loginSmoker";
import DasboardSmoker from "./pages/DashboardSmoker";
import SignupCoach from "./pages/signupCoach";
import LoginCoach from "./pages/loginCoach";
import ControlPanelCoach from "./pages/controlPanelCoach";
import injectContext from "./store/appContext";
import CreateProfileUser from "./pages/createProfile-user";
import CreateConsumProfile from "./pages/ConfiguracionConsumo";
import CreateProfileCoach from "./pages/createProfile-coach";
import LoginSelection from "./pages/LoginSelection";
import SolicitudesCoach from "./pages/SolicitudesCoach";
import ViewProfileCoach from "./pages/ViewProfileCoach";
import ViewProfileSmoker from "./pages/ViewProfileSmoker";
import CoachAddress from "./pages/CoachAddress";
import SmokerCard from "./pages/SmokerCard";
import CoachesList from "./pages/CoachesList";
import ApprovedCoaches from "./pages/coachapprove";
import SolicitudesSmoker from "./pages/SolicitudesSmoker";
import CoachProfile from "./pages/CoachProfile";
import UserProfile from "./pages/ViewProfileSmoker";
import ChatSmoker from "./pages/ChatSmoker";
import ChatCoach from "./pages/ChatCoach";
import AdviceSmoker from "./pages/AdviceSmoker";
import UserSettings from "./component/DasboardSmoker/UserSettings";

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
                        <Route element={<DasboardSmoker />} path="/Dashboard-Smoker" />
                        <Route element={<SignupCoach />} path="/signup-coach" />
                        <Route element={<LoginCoach />} path="/login-coach" />
                        <Route element={<ControlPanelCoach />} path="/control-panel-coach" />
                        <Route element={<SolicitudesSmoker />} path="/Dashboard-Smoker/solicitudes" />
                        <Route element={<SolicitudesCoach />} path="/track-client" />
                        <Route element={<SolicitudesSmoker />} path="/Dashboard-Smoker/track-coach" />
                        <Route element={<CreateProfileUser />} path="/question-profile-smoker" />
                        <Route element={<CreateConsumProfile />} path="/question-config-smoker" />
                        <Route element={<CreateProfileCoach />} path="/question-profile-coach" />
                        <Route element={<LoginSelection />} path="/login-selection" />
                        <Route element={<ViewProfileCoach />} path="/coach-details/:coachId" />
                        <Route element={<ViewProfileSmoker />} path="/Dashboard-Smoker/smoker-profile/:userId" />
                        <Route element={<CoachAddress />} path="/question-address-coach" />
                        <Route element={<CoachesList />} path="/Dashboard-Smoker/coaches" />
                        <Route element={<UserProfile />} path="/user-profile/:userId" />
                        <Route element={<CoachAddress />} path="/question-address-coach" />
                        <Route element={<SmokerCard />} path="/my-clients" /> 
                        <Route element={<ApprovedCoaches />} path="/approved-coaches" />
                        <Route element={<CoachProfile />} path="/coach-profile/:coachId" />
                        <Route element={<ChatSmoker />} path="/Dashboard-Smoker/mensajes" />
                        <Route element={<ChatCoach />} path="/Dashboard-Coach/mensajes" />
                        <Route element={<AdviceSmoker />} path="/Dashboard-Smoker/consejos" />
                        <Route element={<UserSettings />} path="/Dashboard-Smoker/configuracion/:userId" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
