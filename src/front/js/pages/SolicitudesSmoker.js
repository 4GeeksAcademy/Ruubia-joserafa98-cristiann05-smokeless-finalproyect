import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const SolicitudesSmoker = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            if (store.loggedInUser && store.loggedInUser.id) {
                try {
                    await actions.getAllSolicitudes(); // Trae todas las solicitudes
                } catch (error) {
                    setError("Error al cargar las solicitudes");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSolicitudes();
    }, []);

    // Filtrar solicitudes en función del usuario logueado (smoker)
    const solicitudesEnEspera = store.solicitudes.filter(solicitud =>
        solicitud.id_usuario === store.loggedInUser.id && solicitud.estado === false && solicitud.fecha_respuesta === null
    );
    
    const solicitudesAprobadas = store.solicitudes.filter(solicitud =>
        solicitud.id_usuario === store.loggedInUser.id && solicitud.estado === true
    );
    
    const solicitudesRechazadas = store.solicitudes.filter(solicitud =>
        solicitud.id_usuario === store.loggedInUser.id && solicitud.estado === false && solicitud.fecha_respuesta !== null
    );
    

    return (
        <div className="container mt-5 bg-light">
            <h2 className="text-center text-dark mb-4">Mis Solicitudes</h2>
            {loading ? (
                <p className="text-center text-dark">Cargando solicitudes...</p>
            ) : error ? (
                <p className="text-center text-danger">{error}</p>
            ) : (
                <>
                    {/* Solicitudes en Espera */}
                    <h3 className="text-dark">Solicitudes en Espera</h3>
                    {solicitudesEnEspera.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Coach</th>
                                    <th>Comentarios</th>
                                    <th>Fecha de Solicitud</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesEnEspera.map((solicitud) => (
                                    <tr key={solicitud.id}>
                                        <td>{solicitud.nombre_coach}</td>
                                        <td>{solicitud.comentarios}</td>
                                        <td>{solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleString() : 'No disponible'}</td>
                                        <td>En espera de respuesta</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay solicitudes en espera.</p>
                    )}

                    {/* Solicitudes Aprobadas */}
                    <h3 className="text-dark">Solicitudes Aprobadas</h3>
                    {solicitudesAprobadas.length > 0 ? (
                        <table className="table table-success">
                            <thead>
                                <tr>
                                    <th>Coach</th>
                                    <th>Comentarios</th>
                                    <th>Fecha de Solicitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesAprobadas.map((solicitud) => (
                                    <tr key={solicitud.id}>
                                        <td>{solicitud.nombre_coach}</td>
                                        <td>{solicitud.comentarios}</td>
                                        <td>{new Date(solicitud.fecha_solicitud).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay solicitudes aprobadas.</p>
                    )}

                    {/* Solicitudes Rechazadas */}
                    <h3 className="text-dark">Solicitudes Rechazadas</h3>
                    {solicitudesRechazadas.length > 0 ? (
                        <table className="table table-danger">
                            <thead>
                                <tr>
                                    <th>Coach</th>
                                    <th>Comentarios</th>
                                    <th>Fecha de Solicitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesRechazadas.map((solicitud) => (
                                    <tr key={solicitud.id}>
                                        <td>{solicitud.nombre_coach}</td>
                                        <td>{solicitud.comentarios}</td>
                                        <td>{new Date(solicitud.fecha_solicitud).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay solicitudes rechazadas.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default SolicitudesSmoker;
