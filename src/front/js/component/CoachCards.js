import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const CoachCard = () => {
    const { store, actions } = useContext(Context); 
    const [alertMessage, setAlertMessage] = useState(""); 
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Inicializar useNavigate

    useEffect(() => {
        const fetchCoaches = async () => {
            await actions.getAllCoaches(); 
            setIsLoading(false); 
        };
        fetchCoaches();
    }, [actions]);
    
    const handleAddCoach = (coachId) => {
        const solicitudData = {
            id_user: 1, 
            id_coach: coachId, 
            fecha_solicitud: new Date().toISOString(),
            estado: 'pendiente', 
            fecha_respuesta: null, 
            comentarios: 'Estoy interesado en el coaching', 
        };

        actions.addSolicitud(solicitudData)
            .then(() => setAlertMessage("Solicitud enviada exitosamente!"))
            .catch(() => setAlertMessage("Hubo un fallo al enviar la solicitud."));
    };

    // Función para redirigir al perfil del coach
    const handleViewProfile = (coachId) => {
        navigate(`/CoachProfile
            /${coachId}`); 
    };

    return (
        <div className="container mt-5">
            {alertMessage && (
                <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                    {alertMessage}
                </div>
            )}
            <h1 className="text-center mb-4">Coachs Disponibles</h1>
            {store.coaches && store.coaches.length > 0 ? (
                <div className="row">
                    {store.coaches.map((coach) => (
                        <div className="col-md-4 mb-4" key={coach.id}>
                            <div className="card text-dark" style={{ width: "18rem" }}>
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
                <p className="text-center">No hay datos registrados.</p>
            )}
        </div>
    );
};

export default CoachCard;
