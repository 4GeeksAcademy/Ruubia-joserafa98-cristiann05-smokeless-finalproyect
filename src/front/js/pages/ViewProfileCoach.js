import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext"; 

const ViewProfileCoach = () => {
    const { coachId } = useParams(); // Extraer el coachId de la URL
    const { actions, store } = useContext(Context); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        const fetchCoachData = async () => {
            if (!coachId) {
                setError("No se ha proporcionado coachId");
                setLoading(false);
                return;
            }
            try {
                await actions.getCoach(coachId);
                setLoading(false);
                console.log("Datos del coach:", store.coach); // Verifica qué coach se está almacenando
            } catch (error) {
                console.error("Error al obtener los datos del coach:", error);
                setError("No se pudieron obtener los datos del coach.");
                setLoading(false);
            }
        };
        fetchCoachData();
    }, []);

    const coach = store.coach;

    const handleSendRequest = () => {
        const userId = store.loggedInUser.id;

        if (!userId) {
            setAlertMessage("Error: Usuario no autenticado.");
            return;
        }

        const solicitudData = {
            id_usuario: userId,
            id_coach: coachId,
            fecha_solicitud: new Date().toLocaleDateString('es-ES'),
            estado: false,
            fecha_respuesta: null,
            comentarios: 'Estoy interesado en el coaching',
        };

        actions.addSolicitud(solicitudData)
            .then(() => setAlertMessage("Solicitud enviada exitosamente!"))
            .catch(() => setAlertMessage("Hubo un fallo al enviar la solicitud."));
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 text-light">Detalles del Coach</h2>
            {loading ? (
                <p className="text-center text-light">Cargando datos del coach...</p>
            ) : error ? (
                <p className="text-center text-danger">{error}</p> 
            ) : coach && coach.email_coach ? (
                <div className="card bg-dark text-light">
                    <img 
                        src={coach.foto_coach || "https://via.placeholder.com/150"} 
                        alt="Foto del Coach" 
                        className="card-img-top" 
                    />
                    <div className="card-body">
                        <h5 className="card-title">{coach.nombre_coach || 'Nombre no disponible'}</h5>
                        <p className="card-text"><strong>Email:</strong> {coach.email_coach}</p>
                        <p className="card-text"><strong>Género:</strong> {coach.genero_coach || 'No especificado'}</p>
                        <p className="card-text"><strong>Fecha de Nacimiento:</strong> {coach.nacimiento_coach || 'No disponible'}</p>
                        <p className="card-text"><strong>Dirección:</strong> {coach.direccion || 'No disponible'}</p>
                        <p className="card-text"><strong>Latitud:</strong> {coach.latitud || 'No disponible'}</p>
                        <p className="card-text"><strong>Longitud:</strong> {coach.longitud || 'No disponible'}</p>
                        <p className="card-text"><strong>Descripción:</strong> {coach.descripcion_coach || 'No disponible'}</p>
                        <p className="card-text"><strong>Precio del Servicio:</strong> {coach.precio_servicio ? `$${coach.precio_servicio}` : 'No disponible'}</p>

                        <button className="btn btn-primary" onClick={handleSendRequest}>
                            Enviar Solicitud
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-light">No se encontraron datos del coach.</p>
            )}
            {alertMessage && (
                <div className={`alert ${alertMessage.includes("éxitosamente") ? "alert-success" : "alert-danger"}`} role="alert">
                    {alertMessage}
                </div>
            )}
        </div>
    );
};

export default ViewProfileCoach;
