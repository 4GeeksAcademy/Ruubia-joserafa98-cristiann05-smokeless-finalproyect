import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

const LoginCoach = () => {
    const { actions, store } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');  // Limpiar cualquier mensaje de error previo

        const coachData = {
            email_coach: email,
            password_coach: password,
        };

        const loginSuccess = await actions.loginCoach(coachData);

        if (loginSuccess) {
            console.log("Login exitoso, coach ID:", store.loggedInCoach.id);
            navigate('/question-profile-coach');  // Redirigir después de un login exitoso
        } else {
            setError("Error en el login: Credenciales incorrectas.");
        }
    };

    useEffect(() => {
        if (store.loggedInCoach && store.loggedInCoach.id) {
            console.log("Coach logueado:", store.loggedInCoach);
            actions.getCoachInfo(store.loggedInCoach.id);
        } else if (store.loggedInCoach === null) {
            console.error("ID de coach no disponible después de login");
        }
    }, [store.loggedInCoach, actions]);

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
            <button type="submit">Iniciar sesión</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
};

export default LoginCoach;