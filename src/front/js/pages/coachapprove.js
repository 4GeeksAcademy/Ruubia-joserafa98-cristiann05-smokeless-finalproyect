import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import CoachCard from "../component/CoachCards"; // Asegúrate de que tienes un componente para mostrar los detalles del coach

const ApprovedCoaches = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedCoaches = async () => {
            try {
                await actions.getAllSolicitudes(); // Asegúrate de que esta acción recupera todas las solicitudes
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las solicitudes:", error);
                setError("No se pudieron obtener las solicitudes.");
                setLoading(false);
            }
        };

        fetchApprovedCoaches();
    }, [actions]);

    // Filtrar las solicitudes aprobadas
    const solicitudesAprobadas = store.solicitudes.filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null &&
        solicitud.id_usuario === store.loggedInUser.id // Asegúrate de que tienes el ID del usuario en tu store
    );

    // Crear un Set para evitar duplicados por id_coach
    const uniqueCoachIds = new Set();
    const approvedCoaches = solicitudesAprobadas.filter(solicitud => {
        if (!uniqueCoachIds.has(solicitud.id_coach)) {
            uniqueCoachIds.add(solicitud.id_coach);
            return true; // Incluir esta solicitud
        }
        return false; // No incluir si el coach ya está en el Set
    });

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Coaches Aprobados</h2>
            {loading ? (
                <p className="text-center">Cargando datos...</p>
            ) : error ? (
                <p className="text-center">{error}</p>
            ) : approvedCoaches.length > 0 ? (
                <div className="row">
                    {approvedCoaches.map(solicitud => (
                        <div className="col-md-4 mb-4" key={solicitud.id_coach}>
                            <CoachCard coachId={solicitud.id_coach} /> {/* Asegúrate de pasar el ID del coach */}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No tienes coaches aprobados.</p>
            )}
        </div>
    );
};

export default ApprovedCoaches;
