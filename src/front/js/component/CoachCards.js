import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const CoachCard = () => {
    const { store, actions } = useContext(Context); 
    const [alertMessage, setAlertMessage] = useState(""); // Estado para manejar el mensaje de alerta

    useEffect(() => {
        actions.getAllCoaches(); 
    }, []);

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
                                    src={coach.foto_coach || "default_image_url.jpg"}
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
}

export default CoachCard;

