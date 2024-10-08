import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";
import CoachCard from "../component/CoachCards"; // Asegúrate de que está bien importado

const ApprovedCoaches = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedCoaches = async () => {
            try {
                await actions.getAllSolicitudes();
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las solicitudes:", error);
                setError("No se pudieron obtener las solicitudes.");
                setLoading(false);
            }
        };

        fetchApprovedCoaches();
    }, [actions]);

    const solicitudesAprobadas = store.solicitudes.filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null &&
        solicitud.id_usuario === store.loggedInUser.id
    );

    const uniqueCoachIds = new Set();
    const approvedCoaches = solicitudesAprobadas.filter(solicitud => {
        if (!uniqueCoachIds.has(solicitud.id_coach)) {
            uniqueCoachIds.add(solicitud.id_coach);
            return true;
        }
        return false;
    });

    return (
        <div className="container mt-5 mx-3">
            <h2 className="text-center mb-4 text-light">Coaches Aprobados</h2>
            {loading ? (
                <p className="text-center text-light">Cargando datos...</p> 
            ) : error ? (
                <p className="text-center text-danger">{error}</p> // Muestra el error en rojo
            ) : approvedCoaches.length > 0 ? (
                <div className="row">
                    {approvedCoaches.map(solicitud => (
                        <div className="col-md-12 mb-4" key={solicitud.id_coach}>
                            <CoachCard coach={solicitud} /> {/* Pasamos el coach como prop */}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-light">No tienes coaches aprobados.</p>
            )}
        </div>
    );
};

export default ApprovedCoaches;
