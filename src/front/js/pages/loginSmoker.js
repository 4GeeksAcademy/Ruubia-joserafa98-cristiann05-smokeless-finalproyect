import React, { useEffect, useState } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';
import { Link } from "react-router-dom";

// Componente que maneja el login
const LoginSmoker = () => {
    const { actions, store } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

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
        <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
            <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
                <div className="p-12 py-xl-10 px-xl-20">
                    {/* Aquí puedes colocar tu logo */}
                    <div className="d-block">
                        <Link to="/">
                            <img src={logo} alt="Logo" className="logo" />
                        </Link>
                    </div>

                    {/* Ajustes en el título y subtítulo */}
                    <div className="mt-1 text-center px-5"> {/* Añadí text-center y padding lateral */}
                        <h1 className="ls-tight fw-bolder display-6 text-white mb-2"> {/* display-3 para hacerlo más grande */}
                        ¡INICIA SESIÓN!
                        </h1>
                        <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}> {/* Aumenta el tamaño del subtítulo */}
                         ¡Tu nueva vida te espera 🚭!
                        </p>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
                <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
                    <div className="mb-10">
                        <a className="d-inline-block d-lg-none mb-10" href="/pages/dashboard.html">
                            <img src={logoOscuro} alt="Logo Oscuro" className="logo w-25" />
                        </a>
                        <h1 className="ls-tight fw-bolder h1">Log in here</h1> 
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    <form className="form" onSubmit={handleLogin} style={{ fontSize: '1.25rem' }}> {/* Cambiado a handleLogin */}
                        <div className="group mb-4">
                            <i className="fa-regular fa-envelope icon"></i>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo electrónico"
                                required
                                style={{ height: '60px', fontSize: '1.25rem' }}
                            />
                        </div>

                        <div className="group mb-4">
                            <i className="fa-solid fa-lock icon"></i>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className="input"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                style={{ height: '60px', fontSize: '1.25rem' }}
                            />
                        </div>

                        <button className="btn btn-dark w-100" type="submit" style={{ fontSize: '1.25rem', padding: '15px' }}>Iniciar sesión</button> {/* Cambiado el texto del botón */}
                    </form>
                </div>
            </div>
        </div>
    </>
);
};

export default LoginSmoker;
