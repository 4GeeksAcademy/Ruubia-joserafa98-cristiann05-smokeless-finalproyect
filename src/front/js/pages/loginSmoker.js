import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

// Componente que maneja el login
const LoginComponent = () => {
    const { actions, store } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const smokerData = {
            email_usuario: email,
            password_email: password,
        };

        // Llama a la acción de login y maneja la respuesta
        const loginSuccess = await actions.loginSmoker(smokerData);

        if (loginSuccess) {
            console.log("Login exitoso, usuario ID:", store.loggedInUser.id); // Verifica ID aquí
        } else {
            console.error("Error en el login");
        }
    };

    useEffect(() => {
        // Verificar si loggedInUser se actualiza
        if (store.loggedInUser) {
            console.log("Usuario logueado:", store.loggedInUser); // Log para verificar
            const userId = store.loggedInUser.id; // Accede a id solo si loggedInUser no es null
            
            if (userId) {
                // Llama a getUserInfo para obtener información del usuario
                actions.getUserInfo(userId);
            } else {
                console.error("ID de usuario no disponible después de login");
            }
        }
    }, [store.loggedInUser, actions]); // Reacciona a los cambios en loggedInUser

    useEffect(() => {
        // Verifica si userInfo está completo
        if (store.userInfo) {
            console.log("userInfo actual:", store.userInfo); // Log para verificar
            const userInfoComplete = store.userInfo.nombre_usuario && 
                store.userInfo.genero_usuario && 
                store.userInfo.nacimiento_usuario &&
                store.userInfo.tiempo_fumando &&
                store.userInfo.periodicidad_consumo && 
                store.userInfo.numero_cigarrillos;

            if (userInfoComplete) {
                // Redirigir al panel de control
                navigate("/control-panel-smoker");
            } else {
                // Redirigir a los formularios
                navigate("/question-profile-smoker");
            }
        }
    }, [store.userInfo, navigate]); // Verifica cuando userInfo cambia

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
        </form>
    );
};

export default LoginComponent;
