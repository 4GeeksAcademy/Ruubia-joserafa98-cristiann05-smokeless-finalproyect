import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/navbar';

// Componente que maneja el login
const LoginSmoker = () => {
    const { actions, store } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
            
            // Almacena el refresh token
            const refreshToken = localStorage.getItem('refreshToken'); // Almacena el refresh token
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }

            // Verifica si es la primera vez que inicia sesión y almacena la fecha de registro
            const isFirstLogin = !localStorage.getItem('fechaRegistro'); // Si no existe la fecha, es el primer login
            if (isFirstLogin) {
                const fechaRegistro = new Date().toISOString(); // Fecha actual en formato ISO
                localStorage.setItem('fechaRegistro', fechaRegistro); // Almacena la fecha de registro
                console.log("Fecha de registro almacenada:", fechaRegistro); // Verifica que se almacene correctamente
            }

            // Llama a getUserInfo para obtener información del usuario después del login
            if (userId) {
                await actions.getUserInfo(userId);
            }
        } else {
            // Manejo de error
            setErrorMessage("Error en el inicio de sesión. Verifica tu correo electrónico y contraseña.");
            console.error("Error en el login");
        }
    };

    // Función para refrescar el token
    const refreshToken = async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) return;

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedRefreshToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwtToken', data.access_token); // Almacena el nuevo token de acceso
                console.log("Token de acceso refrescado:", data.access_token);
            } else {
                console.error("Error al refrescar el token");
                // Manejo adicional si el refresh token es inválido o ha expirado
            }
        } catch (error) {
            console.error("Error en la solicitud de refresco de token:", error);
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

    // Configura un intervalo para refrescar el token cada 15 minutos
    useEffect(() => {
        const interval = setInterval(refreshToken, 15 * 60 * 1000); // 15 minutos
        return () => clearInterval(interval); // Limpieza al desmontar el componente
    }, []);

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
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
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
