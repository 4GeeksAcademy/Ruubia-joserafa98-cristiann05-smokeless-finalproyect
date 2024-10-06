import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const SolicitudesCoach = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchSolicitudes = async () => {
            if (store.loggedInCoach && store.loggedInCoach.id) {
                try {
                    await actions.getAllSolicitudes(store.loggedInCoach.id);
                } catch (error) {
                    setError("Error al cargar las solicitudes");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSolicitudes();
    }, [store.loggedInCoach, actions]);

    const handleUpdate = async (solicitudId, updatedData) => {
        try {
            await actions.updateSolicitud(solicitudId, updatedData);
            
            // Filtrar la solicitud actualizada para que no aparezca en "solicitudes recibidas"
            const updatedSolicitudes = store.solicitudes.filter(solicitud => solicitud.id !== solicitudId);
            
            actions.setStore({ solicitudes: updatedSolicitudes });
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error);
        }
    };
    
    

    const handleApprove = async (solicitudId) => {
        await handleUpdate(solicitudId, {
            estado: 'true',
            fecha_respuesta: new Date().toLocaleDateString('en-GB')
        });
    };
    
    const handleReject = async (solicitudId) => {
        await handleUpdate(solicitudId, {
            estado: 'false',
            fecha_respuesta: new Date().toLocaleDateString('en-GB')
        });
    };

    const solicitudesAprobadas = store.solicitudes.filter(solicitud => solicitud.estado === true);
    const solicitudesRechazadas = store.solicitudes.filter(solicitud => solicitud.estado === false);
    const solicitudesRecibidas = store.solicitudes;

    return (
        <div className="container mt-5 bg-light">
            <h2 className="text-center text-dark mb-4">Solicitudes Recibidas</h2>
            {loading ? (
                <p className="text-center text-dark">Cargando solicitudes...</p>
            ) : error ? (
                <p className="text-center text-danger">{error}</p>
            ) : (
                <>
                    {/* Tabla de Solicitudes Recibidas */}
                    <h3 className="text-dark">Solicitudes Recibidas</h3>
                    {solicitudesRecibidas.length > 0 ? (
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Comentarios</th>
                                    <th>Fecha de Solicitud</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesRecibidas.map((solicitud) => (
                                    solicitud.fecha_respuesta === null ? ( // Mostrar solo si la fecha_respuesta es null
                                        <tr key={solicitud.id}>
                                            <td>{solicitud.nombre_usuario}</td>
                                            <td>{solicitud.comentarios}</td>
                                            <td>{solicitud.fecha_solicitud ? new Date(solicitud.fecha_solicitud).toLocaleString() : 'No disponible'}</td>
                                            <td>{solicitud.estado}</td>
                                            <td>
                                                <button className="btn btn-success me-2" onClick={() => handleApprove(solicitud.id)}>Aprobar</button>
                                                <button className="btn btn-danger" onClick={() => handleReject(solicitud.id)}>Rechazar</button>
                                            </td>
                                        </tr>
                                    ) : null // No mostrar si la fecha_respuesta no es null
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay solicitudes recibidas.</p>
                    )}
    
                    {/* Tabla de Solicitudes Aprobadas */}
                    <h3 className="text-dark">Solicitudes Aprobadas</h3>
                    {solicitudesAprobadas.length > 0 ? (
                        <table className="table table-success">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Comentarios</th>
                                    <th>Fecha de Solicitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesAprobadas.map((solicitud) => (
                                    solicitud.estado === true && solicitud.fecha_respuesta ? ( // Mostrar solo si el estado es true y hay una fecha_respuesta
                                        <tr key={solicitud.id}>
                                            <td>{solicitud.nombre_usuario}</td>
                                            <td>{solicitud.comentarios}</td>
                                            <td>{new Date(solicitud.fecha_solicitud).toLocaleString()}</td>
                                        </tr>
                                    ) : null // No mostrar si no cumple las condiciones
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No hay solicitudes aprobadas.</p>
                    )}
    
                    {/* Tabla de Solicitudes Rechazadas */}
                    <h3 className="text-dark">Solicitudes Rechazadas</h3>
                    {solicitudesRechazadas.length > 0 ? (
                        <table className="table table-danger">
                            <thead>
                                <tr>
                                    <th>Usuario</th>
                                    <th>Comentarios</th>
                                    <th>Fecha de Solicitud</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudesRechazadas.map((solicitud) => (
                                    solicitud.estado === false && solicitud.fecha_respuesta ? ( // Mostrar solo si el estado es false y hay una fecha_respuesta
                                        <tr key={solicitud.id}>
                                            <td>{solicitud.nombre_usuario}</td>
                                            <td>{solicitud.comentarios}</td>
                                            <td>{new Date(solicitud.fecha_solicitud).toLocaleString()}</td>
                                        </tr>
                                    ) : null // No mostrar si no cumple las condiciones
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
       
}    

export default SolicitudesCoach;



