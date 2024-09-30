import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const LoginCoach = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false); // To handle errors
    const [success, setSuccess] = useState(false); // To handle success messages
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const coachData = { email_coach: email, password_coach: password };

        try {
            const success = await actions.loginCoach(coachData);
            if (success) {
                setSuccess(true); // Success message
                setTimeout(() => {
                    navigate("/control-panel-coach"); // Redirect to control panel
                }, 2000); // Wait 2 seconds before redirecting
            } else {
                setError(true); // Error message
            }
        } catch (error) {
            setError(true); // Error message
        }
    };

    return (
        <div className="container mt-5">
            <h1>Login for Coaches</h1>
            {error && <div className="alert alert-danger" role="alert">Error: Invalid credentials. Please try again.</div>} {/* Show error message */}
            {success && <div className="alert alert-success" role="alert">Login successful. Redirecting to control panel...</div>} {/* Show success message */}
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default LoginCoach;
