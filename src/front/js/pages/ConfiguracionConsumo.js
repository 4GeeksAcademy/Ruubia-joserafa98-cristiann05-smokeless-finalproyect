import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; // Importar el CSS específico
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const CreateConsumProfile = () => {
    const { store, actions } = useStore();
    const [formaConsumo, setFormaConsumo] = useState("cigarros"); // Valor por defecto
    const [numeroCigarrillos, setNumeroCigarrillos] = useState(""); // Valor por defecto
    const [periodicidadConsumo, setPeriodicidadConsumo] = useState("diaria"); // Valor por defecto
    const [tiempoFumando, setTiempoFumando] = useState(""); // Valor por defecto
    const [error, setError] = useState(""); // Estado para manejar errores
    const navigate = useNavigate(); // Hook para la navegación

    // Cargar información del usuario logueado al montar el componente
    useEffect(() => {
        if (store.loggedInUser) {
            console.log("Usuario logueado en CreateConsumProfile:", store.loggedInUser); // Log de usuario logueado
            setFormaConsumo(store.loggedInUser.forma_consumo || "cigarros");
            setNumeroCigarrillos(store.loggedInUser.numero_cigarrillos || "");
            setPeriodicidadConsumo(store.loggedInUser.periodicidad_consumo || "diaria");
            setTiempoFumando(store.loggedInUser.tiempo_fumando || "");

            // Almacenar el usuario en localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(store.loggedInUser)); // Guardar en localStorage
        }
    }, [store.loggedInUser]);

    // Cargar tipos de consumo desde el store al montar el componente
    useEffect(() => {
        actions.getTiposConsumo(); // Cargar tipos de consumo desde el store
    }, [actions]);

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setError(""); // Reinicia el estado de error

        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return; // Sale de la función si no hay usuario logueado
        }

        // Datos a actualizar
        const updatedData = {
            forma_consumo: formaConsumo,
            numero_cigarrillos: numeroCigarrillos !== "" ? parseInt(numeroCigarrillos) : null, // Asegúrate de que sea un número o null
            periodicidad_consumo: periodicidadConsumo,
            tiempo_fumando: tiempoFumando,
        };

        console.log("Datos enviados en el consumo:", updatedData); // Log de datos enviados

        // Intenta actualizar el perfil de consumo
        const success = await actions.updateConsumptionProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Información de consumo actualizada con éxito");

            // Actualizar los datos almacenados en localStorage después del éxito
            const updatedUser = { ...store.loggedInUser, ...updatedData };
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser)); // Guardar datos actualizados en localStorage

            navigate('/Dashboard-Smoker'); // Redirige al dashboard
        } else {
            alert("Error al actualizar la información de consumo");
        }
    };

    // Muestra un mensaje si no hay usuario logueado
    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    // Obtiene los tipos de consumo desde el store
    const tiposConsumo = store.tiposConsumo || []; // Asegúrate de que se esté almacenando en el store

    // Renderiza el formulario
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
                            <div className="mt-1 text-center px-5">
                                <h1 className="ls-tight fw-bolder display-6 text-white mb-3">
                                ¡CUÉNTANOS TUS HÁBITOS DE CONSUMO!
                                </h1>
                                <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                Queremos entender mejor tu relación con el tabaco. Comparte con nosotros cuánto y con qué frecuencia fumas.
                                </p>
                            </div>
                        </div>
    
                    </div>
    
                    <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
                        <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
                            <div className="mb-10">
                                <a className="d-inline-block d-lg-none mb-10" href="/pages/dashboard.html">
                                    <img src={logoOscuro} alt="Logo Oscuro" className="logo" />
                                </a>
                                <h1 className="ls-tight fw-bolder h1">Tu perfil como consumidor</h1> 
                            </div>
    
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form className="form" onSubmit={handleSubmit} style={{ fontSize: '1.25rem' }}>
                            
                            {/* Forma de Consumo */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-filter icon"></i>
                                <select
                                    value={formaConsumo}
                                    onChange={(e) => setFormaConsumo(e.target.value)}
                                    className="input"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                >
                                    <option value="" disabled>Selecciona la forma de consumo</option>
                                    {tiposConsumo.map(tipo => (
                                        <option key={tipo.id} value={tipo.name}>{tipo.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Número de Cigarrillos */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-smoking icon"></i>
                                <input
                                    type="number"
                                    name="numeroCigarrillos"
                                    className="input"
                                    value={numeroCigarrillos}
                                    onChange={(e) => setNumeroCigarrillos(e.target.value)}
                                    placeholder="Número de cigarrillos por día"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>

                            {/* Periodicidad de Consumo */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-calendar icon"></i>
                                <select
                                    value={periodicidadConsumo}
                                    onChange={(e) => setPeriodicidadConsumo(e.target.value)}
                                    className="input"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                >
                                    <option value="" disabled>Selecciona la periodicidad</option>
                                    <option value="diaria">Diaria</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="anual">Anual</option>
                                </select>
                            </div>

                            {/* Tiempo Fumando */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-clock icon"></i>
                                <input
                                    type="number"
                                    name="tiempoFumando"
                                    className="input"
                                    value={tiempoFumando}
                                    onChange={(e) => setTiempoFumando(e.target.value)}
                                    placeholder="Tiempo fumando (en años)"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>

                            <button className="btn btn-dark w-100" type="submit" style={{ fontSize: '1.25rem', padding: '15px' }}>
                                Crear Perfil de Consumo
                            </button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    };    

export default CreateConsumProfile;