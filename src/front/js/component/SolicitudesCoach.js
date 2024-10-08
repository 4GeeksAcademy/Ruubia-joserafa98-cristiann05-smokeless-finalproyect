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
        try {
            await handleUpdate(solicitudId, {
                estado: true,  // Asegúrate de que esto sea un booleano
                fecha_respuesta: new Date().toLocaleDateString('en-GB') // En formato dd/mm/yyyy
            });
    
            // Retraso para permitir la actualización
            setTimeout(async () => {
                if (store.loggedInCoach && store.loggedInCoach.id) {
                    await actions.getAllSolicitudes(); // Para obtener la lista actualizada
                }
            }, 1000);
            
        } catch (error) {
            console.error("Error al aprobar la solicitud:", error);
        }
    };
    
    const handleReject = async (solicitudId) => {
        await handleUpdate(solicitudId, {
            estado: false, // Booleano false en lugar de string
            fecha_respuesta: new Date().toLocaleDateString('en-GB')
        });
    };

    // Filtrar solicitudes en función del coach logueado
    const solicitudesRecibidas = store.solicitudes.filter(solicitud => 
        solicitud.id_coach === store.loggedInCoach.id && solicitud.fecha_respuesta === null
    );

    const solicitudesAprobadas = store.solicitudes.filter(solicitud => 
        solicitud.id_coach === store.loggedInCoach.id && solicitud.estado === true
    );

    const solicitudesRechazadas = store.solicitudes.filter(solicitud => 
        solicitud.id_coach === store.loggedInCoach.id && solicitud.estado === false && solicitud.fecha_respuesta !== null
    );

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
                                    <tr key={solicitud.id}>
                                        <td>{solicitud.nombre_usuario}</td>
                                        <td>{solicitud.comentarios}</td>
                                        <td>{new Date(solicitud.fecha_solicitud).toLocaleString()}</td>
                                    </tr>
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
                                    <tr key={solicitud.id}>
                                        <td>{solicitud.nombre_usuario}</td>
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

export default SolicitudesCoach;
