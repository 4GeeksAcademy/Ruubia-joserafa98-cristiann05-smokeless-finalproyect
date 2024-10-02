import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const SolicitudesCoach = ({ coachId }) => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.getSolicitudesPorCoach(coachId);
    }, [coachId, actions]);

    const handleApprove = (solicitudId) => {
        // Llama a la acción para aprobar la solicitud
        actions.approveSolicitud(solicitudId);
    };

    const handleReject = (solicitudId) => {
        // Llama a la acción para rechazar la solicitud
        actions.rejectSolicitud(solicitudId);
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Solicitudes Recibidas</h2>
            {store.solicitudes && store.solicitudes.length > 0 ? (
                <ul className="list-group">
                    {store.solicitudes.map((solicitud) => (
                        <li className="list-group-item" key={solicitud.id}>
                            <p><strong>Usuario:</strong> {solicitud.name_user}</p>
                            <p><strong>Comentarios:</strong> {solicitud.comentarios}</p>
                            <p><strong>Estado:</strong> {solicitud.estado}</p>
                            <p><strong>Fecha de Solicitud:</strong> {new Date(solicitud.fecha_solicitud).toLocaleString()}</p>
                            <button
                                className="btn btn-success me-2"
                                onClick={() => handleApprove(solicitud.id)}
                            >
                                Aprobar
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleReject(solicitud.id)}
                            >
                                Rechazar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center">No hay solicitudes disponibles.</p>
            )}
        </div>
    );
};

export default SolicitudesCoach;
