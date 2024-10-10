import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/navbar';

// Componente que maneja el login
const LoginSmoker = () => {
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

        console.log("Datos de inicio de sesión:", smokerData); // Verifica los datos que se están enviando

        // Llama a la acción de login y maneja la respuesta
        const loginSuccess = await actions.loginSmoker(smokerData);

        if (loginSuccess) {
            // Almacena el ID del usuario desde localStorage
            const userId = localStorage.getItem('userId'); // Obtén el ID desde localStorage
            console.log("ID almacenado en localStorage:", userId); // Verifica que se almacene correctamente

            // Almacena el token desde localStorage o llama a getToken
            const token = localStorage.getItem('jwtToken') || await actions.getToken(); 
            localStorage.setItem('jwtToken', token); // Almacena el token
            console.log("Token almacenado en localStorage:", localStorage.getItem('jwtToken')); // Verifica que se almacene correctamente
            
            // Llama a getUserInfo para obtener información del usuario después del login
            if (userId) {
                actions.getUserInfo(userId);
            }
        } else {
            console.error("Error en el login");
        }
    };

    useEffect(() => {
        // Verificar si loggedInUser se actualiza
        if (store.loggedInUser) {
            console.log("Usuario logueado:", store.loggedInUser); // Log para verificar
        }
    }, [store.loggedInUser]); // Reacciona a los cambios en loggedInUser

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
                navigate("/Dashboard-Smoker");
            } else {
                // Redirigir a los formularios
                navigate("/question-profile-smoker");
            }
        }
    }, [store.userInfo, navigate]); // Verifica cuando userInfo cambia

    return (
        <>
            <Navbar />
            <div className="form-container">
                <p className="title">Iniciar sesión</p>
                <form className="form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Ingrese su correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="forgot">
                            <a rel="noopener noreferrer" href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <button className="sign" type="submit">Iniciar sesión</button>
                </form>
                <div className="social-message">
                    <div className="line"></div>
                    <p className="message">Inicia sesión con cuentas sociales</p>
                    <div className="line"></div>
                </div>
                <div className="social-icons">
                    {/* Botones de inicio de sesión social aquí */}
                </div>
            </div>
        </>
    );
};

export default LoginSmoker;
