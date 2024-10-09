// CoachesList.js
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/DasboardSmoker/Sidebar.js"; // Importa el nuevo componente Sidebar
import Header from "../component/DasboardSmoker/Header.js"; // Importa el nuevo componente Header
import '../../styles/coacheslist.css';

const CoachesList = () => {
    const { store, actions } = useContext(Context);
    const [alertMessage, setAlertMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchCity, setSearchCity] = useState(""); // Estado para la ciudad
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            await actions.getAllCoaches(); // Trae todos los coaches
            await actions.getAllSolicitudes(); // Trae todas las solicitudes
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const formatFecha = (date) => {
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const fechaSolicitud = formatFecha(new Date());

    const handleAddCoach = (coachId) => {
        const userId = store.loggedInUser?.id;
        if (!userId) {
            setAlertMessage("Error: Usuario no autenticado.");
            return;
        }

        const solicitudData = {
            id_usuario: userId,
            id_coach: coachId,
            fecha_solicitud: fechaSolicitud,
            estado: false,
            fecha_respuesta: null,
            comentarios: 'Estoy interesado en el coaching',
        };

        actions.addSolicitud(solicitudData)
            .then(() => {
                setAlertMessage("Solicitud enviada exitosamente!");
                actions.getAllCoaches();
                actions.getAllSolicitudes();
            })
            .catch((error) => {
                console.error("Error al enviar la solicitud:", error);
                setAlertMessage("Hubo un fallo al enviar la solicitud.");
            });
    };

    const handleViewProfile = (coachId) => {
        navigate(`/coach-details/${coachId}`);
    };

    // Filtrar coaches por ciudad y por solicitudes
    const filteredCoaches = store.coaches
        .filter(coach => {
            const hasRequest = store.solicitudes.some(solicitud => {
                return (
                    solicitud.id_coach === coach.id &&
                    solicitud.id_usuario === store.loggedInUser.id &&
                    (solicitud.fecha_respuesta !== null || solicitud.estado === true)
                );
            });
            return !hasRequest; // Retorna los coaches que no tienen solicitudes pendientes ni aprobadas
        })
        .filter(coach => {
            return coach.direccion.toLowerCase().includes(searchCity.toLowerCase()); // Filtra por ciudad
        });

    return (
        <div className="user-dashboard-container">
            <Sidebar navigate={navigate} /> {/* Utiliza el nuevo componente Sidebar */}
            <div className="user-main-layout">
                <Header onLogout={() => actions.logoutsmoker()} /> {/* Utiliza el nuevo componente Header */}
                <div className="user-main-content"> {/* Contenido principal */}
                    {alertMessage && (
                        <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                            {alertMessage}
                        </div>
                    )}
                    <h1 className="text-center mb-4">Coaches Disponibles</h1>

                    {/* Input para filtrar por ciudad */}
                    <div className="form-group mb-4">
                        <label className="text-light" htmlFor="searchCity">Buscar por Ciudad:</label>
                        <input
                            type="text"
                            id="searchCity"
                            className="form-control"
                            placeholder="Escribe una ciudad"
                            value={searchCity}
                            onChange={(e) => setSearchCity(e.target.value)} // Actualiza el estado con la ciudad ingresada
                        />
                    </div>

                    {isLoading ? (
                        <p className="text-center text-light">Cargando datos...</p>
                    ) : filteredCoaches && filteredCoaches.length > 0 ? (
                        <div className="row">
                            {filteredCoaches.map((coach) => (
                                <div className="col-md-4 mb-4" key={coach.id}> {/* Cambiado a col-md-4 para tres tarjetas por fila */}
                                    <div className="card text-light">
                                        <img
                                            src={coach.foto_coach || "https://i.pinimg.com/550x/a8/0e/36/a80e3690318c08114011145fdcfa3ddb.jpg"}
                                            className="card-img-top"
                                            alt={coach.nombre_coach || "Imagen no disponible"}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{coach.nombre_coach}</h5>
                                            <p className="card-text">
                                                <strong>Género:</strong> {coach.genero_coach}
                                            </p>
                                            <p className="card-text">
                                                <strong>¿Quién soy?:</strong> {coach.descripcion_coach}
                                            </p>
                                            <p className="card-text">
                                                <strong>Dirección:</strong> {coach.direccion}
                                            </p>
                                            <button className="btn btn-primary" onClick={() => handleAddCoach(coach.id)}>
                                                Agregar Coach
                                            </button>
                                            <button className="btn btn-info mt-2" onClick={() => handleViewProfile(coach.id)}>
                                                Ver Perfil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-light">No hay coaches disponibles en esta ciudad.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoachesList;
