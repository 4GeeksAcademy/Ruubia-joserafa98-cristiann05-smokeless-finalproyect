import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/logins.css'; // Asegúrate de que esta ruta sea correcta
import Navbar from '../component/navbar';

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
            const userId = store.loggedInUser.id;

            if (userId) {
                actions.getUserInfo(userId);
            } else {
                console.error("ID de usuario no disponible después de login");
            }
        }
    }, [store.loggedInUser, actions]);

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
                navigate("/dashboard-smoker");
            } else {
                navigate("/question-profile-smoker");
            }
        }
    }, [store.userInfo, navigate]);

    return (
        <div>
            <Navbar />
            <div className="form-container">
                <p className="title">Iniciar Sesión</p>
                <form onSubmit={handleLogin} className="form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Contraseña" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <div className="forgot">
                            <a rel="noopener noreferrer" href="/forgot-password">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <button type="submit" className="sign">Iniciar sesión</button>
                </form>
                <div className="social-message">
                    <div className="line"></div>
                    <p className="message">Inicia sesión con cuentas sociales</p>
                    <div className="line"></div>
                </div>
                <div className="social-icons">
                    <button aria-label="Log in with Google" className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                        </svg>
                    </button>
                    <button aria-label="Log in with Twitter" className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <path d="M31.937 6.093c-1.177 0.516-2.437 0.871-3.765 1.032 1.355-0.813 2.391-2.099 2.885-3.631-1.271 0.74-2.677 1.276-4.18 1.566-1.208-1.285-2.922-2.096-4.822-2.096-3.637 0-6.578 2.94-6.578 6.578 0 0.516 0.061 1.023 0.183 1.508-5.469-0.274-10.319-2.894-13.557-6.87-0.567 0.98-0.893 2.119-0.893 3.332 0 2.307 1.192 4.328 2.997 5.515-1.1-0.035-2.136-0.335-3.036-0.834v0.085c0 3.214 2.285 5.892 5.318 6.513-0.556 0.151-1.141 0.232-1.734 0.232-0.424 0-0.836-0.041-1.247-0.115 0.837 2.609 3.264 4.511 6.133 4.56-2.248 1.76-5.078 2.816-8.132 2.816-0.528 0-1.053-0.031-1.568-0.093 2.918 1.873 6.395 2.971 10.121 2.971 12.136 0 18.838-10.106 18.838-18.837 0-0.287-0.006-0.572-0.018-0.854 1.292-0.932 2.41-2.092 3.303-3.415z"></path>
                        </svg>
                    </button>
                    {/* Botón de GitHub */}
                    <button aria-label="Log in with GitHub" className="icon">
                        <svg xmlns="http://github.com/favicon.ico" viewBox="0 0 32 32">
                            <path d="M16 0c-8.837 0-16 7.163-16 16 0 7.075 4.579 13.063 10.94 15.17.8.148 1.092-.347 1.092-.773 0-.38-.014-1.648-.025-3.061-4.455.966-5.395-2.146-5.395-2.146-.727-1.848-1.773-2.337-1.773-2.337-1.448-.991.11-.971.11-.971 1.6.113 2.44 1.644 2.44 1.644 1.422 2.431 3.731 1.728 4.638 1.32.144-1.033.557-1.728 1.011-2.126-3.55-.4-7.283-1.775-7.283-7.9 0-1.743.622-3.165 1.646-4.287-.165-.4-.712-2.014.155-4.187 0 0 1.34-.43 4.4 1.644 1.28-.356 2.664-.532 4.022-.538 1.357.006 2.742.182 4.022.538 3.059-2.075 4.4-1.644 4.4-1.644.867 2.173.322 3.787.158 4.187 1.023 1.122 1.645 2.544 1.645 4.287 0 6.136-3.736 7.493-7.294 7.883.572.495 1.078 1.472 1.078 2.971 0 2.147-.02 3.882-.02 4.401 0 .428.29.926 1.092.773C27.421 29.063 32 23.075 32 16c0-8.837-7.163-16-16-16z"></path>
                        </svg>
                    </button>
                </div>
                <div className="signup">
                    <p>¿No tienes cuenta? <a href="/signup">Regístrate aquí</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
