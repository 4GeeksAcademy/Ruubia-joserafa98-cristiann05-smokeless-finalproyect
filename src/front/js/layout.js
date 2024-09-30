// src/front/js/layout.js
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import SmokerUser from "./pages/smokerUser";
import SignupSmoker from "./pages/signupSmoker";
import LoginSmoker from "./pages/loginSmoker" 
import ControlPanelSmoker from "./pages/controlPanelSmoker";
import TiposConsumo from "./pages/tiposConsumo";
import CoachUser from "./pages/CoachUser"; 
import SignupCoach from "./pages/signupCoach";
import LoginCoach from "./pages/loginCoach"
import ControlPanelCoach from "./pages/controlPanelCoach";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<SmokerUser />} path="/smokeruser" />
                        <Route element={<SignupSmoker />} path="/signup-smoker" />
                        <Route element={<LoginSmoker />} path="/login-smoker" />
                        <Route element={<ControlPanelSmoker />} path="/control-panel-smoker" />
                        <Route element={<TiposConsumo />} path="/tiposconsumo" />
                        <Route element={<CoachUser />} path="/coaches" />
                        <Route element={<SignupCoach />} path="/signup-coach" />
                        <Route element={<LoginCoach />} path="/login-coach" />
                        <Route element={<ControlPanelCoach />} path="/control-panel-coach" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
