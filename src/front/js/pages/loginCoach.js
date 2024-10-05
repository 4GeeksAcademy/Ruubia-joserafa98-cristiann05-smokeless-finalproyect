import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

// Componente que maneja el login para el coach
const LoginCoach = () => {
    const { actions, store } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const coachData = {
            email_coach: email,
            password_coach: password,
        };

        const loginSuccess = await actions.loginCoach(coachData);

        if (loginSuccess) {
            console.log("Login exitoso, coach ID:", store.loggedInCoach.id);
        } else {
            setErrorMessage("Error en el inicio de sesión. Verifica tus credenciales.");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (store.loggedInCoach) {
            console.log("Coach logueado:", store.loggedInCoach);
            const coachId = store.loggedInCoach.id;

            if (coachId) {
                actions.getCoachInfo(coachId);
            } else {
                console.error("ID de coach no disponible después de login");
            }
        }
    }, [store.loggedInCoach, actions]);

    useEffect(() => {
        if (store.coachInfo) {
            console.log("Información del coach actual:", store.coachInfo);
            // Verifica si los campos necesarios están completos
            const coachInfoComplete = store.coachInfo.nombre &&
                store.coachInfo.genero &&
                store.coachInfo.cumpleaños; // Aquí seguimos revisando el cumpleaños

            console.log("¿Información del coach completa?", coachInfoComplete);

            if (coachInfoComplete) {
                console.log("Redirigiendo al panel de control...");
                navigate("/control-panel-coach");
            } else {
                console.log("Redirigiendo a la actualización del perfil...");
                navigate("/question-profile-coach");
            }
        }
    }, [store.coachInfo, navigate]);

    return (
        <form onSubmit={handleLogin}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Contraseña" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit" disabled={loading}>Iniciar sesión</button>
            {loading && <p>Cargando...</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
};

export default LoginCoach;
