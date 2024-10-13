import React, { useContext, useState } from "react"; // Importar React
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirección
import { Context } from "../store/appContext"; // Importar el contexto
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const LoginCoach = () => {
    const { actions } = useContext(Context); // Obtener las acciones del contexto
    const navigate = useNavigate(); // Inicializar el hook para la navegación
    const [error, setError] = useState('');
    const [email, setEmail] = useState(''); // Definir estado para email
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Obtener el email y la contraseña del formulario
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        // Validar que ambos campos no estén vacíos
        if (!email || !password) {
            console.log("Por favor, completa todos los campos."); // Mensaje de error en consola
            return; // Salir de la función si hay campos vacíos
        }

        const coachData = {
            email_coach: email, // Obtener el email del formulario
            password_coach: password, // Obtener la contraseña del formulario
        };

        try {
            // Llama a la acción de inicio de sesión y maneja la respuesta
            const loginResponse = await actions.loginCoach(coachData);

            // Verifica que la respuesta contenga un ID de coach
            if (loginResponse && loginResponse.coach_id) {
                console.log("Login exitoso, coach ID:", loginResponse.coach_id);

                const coachId = localStorage.getItem('coachId'); // Obtén el ID desde localStorage
            console.log("ID almacenado en localStorage:", coachId); // Verifica que se almacene correctamente

            // Almacena el token desde localStorage o llama a getToken
            const tokenCoach = localStorage.getItem('jwtTokenCoach') || await actions.getToken(); 
            localStorage.setItem('jwtTokenCoach', tokenCoach); // Almacena el token
            console.log("Token almacenado en localStorage:", localStorage.getItem('jwtTokenCoach')); // Verifica que se almacene correctamente

                // Cargar información del coach después de iniciar sesión
                const coachInfo = await actions.getCoachInfo(loginResponse.coach_id);

                if (coachInfo) {
                    console.log("Información del coach:", coachInfo);

                    // Verificar si el coach tiene la información necesaria
                    const hasRequiredInfo =
                        coachInfo.nombre_coach &&
                        coachInfo.nacimiento_coach &&
                        coachInfo.genero_coach &&
                        coachInfo.direccion &&
                        coachInfo.latitud &&
                        coachInfo.longitud;

                    if (hasRequiredInfo) {
                        console.log("Redirigiendo a panel de control de coach..."); // Log para verificar
                        navigate("/control-panel-coach"); // Redirigir al panel de control de coach
                    } else {
                        console.log("Faltan datos, redirigiendo a completar información...");
                        navigate("/question-profile-coach"); // Redirigir a la página para completar información
                    }
                } else {
                    console.error("No se pudo obtener la información del coach después de iniciar sesión.");
                    console.log("Error al cargar la información del coach. Inténtalo de nuevo."); // Mensaje de error en consola
                }
            } else {
                console.error("Error en el login: Respuesta no válida");
                console.log("Credenciales incorrectas. Por favor, inténtalo de nuevo."); // Mensaje de error en consola
            }
        } catch (error) {
            console.error("Se produjo un error al intentar iniciar sesión:", error);
            console.log("Ocurrió un error inesperado. Inténtalo de nuevo."); // Mensaje de error en consola
        }
    };

    return (
        <>
        <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
            <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
                <div className="p-12 py-xl-10 px-xl-20">
                    {/* Aquí puedes colocar tu logo */}
                    <div className="d-block">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>

                    {/* Ajustes en el título y subtítulo */}
                    <div className="mt-16 text-center px-4"> {/* Añadí text-center y padding lateral */}
                        <h1 className="ls-tight fw-bolder display-3 text-white mb-5"> {/* display-3 para hacerlo más grande */}
                            ¡INICIA SESIÓN Y CONTINÚA TRANSFORMANDO VIDAS!
                        </h1>
                        <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}> {/* Aumenta el tamaño del subtítulo */}
                        Accede a tu panel de control, donde podrás conectar con smokers, ofrecer tu apoyo y aprovechar todas las herramientas que tenemos para ayudarte a guiar a tus clientes hacia una vida sin tabaco.
                        </p>
                    </div>
                </div>

                <div className="mt-auto ps-16 ps-xl-20">
                    <img 
                        src="https://images.pexels.com/photos/2977567/pexels-photo-2977567.jpeg?auto=compress&cs=tinysrgb&w=600" 
                        className="img-fluid rounded-top-start-4 custom-img" 
                        alt="Side Image" 
                    />
                </div>
            </div>

            <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
                <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
                    <div className="mb-10">
                        <a className="d-inline-block d-lg-none mb-10" href="/pages/dashboard.html">
                            <img src={logoOscuro} alt="Logo Oscuro" className="logo" />
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

export default LoginCoach;