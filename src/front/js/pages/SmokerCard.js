import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const SmokerCard = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSmokersAndSolicitudes = async () => {
            try {
                // Llamar a la acción de obtener smokers y solicitudes
                await actions.getAllsmoker();
                await actions.getAllSolicitudes();
            } catch (error) {
                setError("Error al obtener los datos");
                console.error("Error al obtener los datos:", error);
            } finally {
                setLoading(false);  // Asegurarse de que loading se desactiva
            }
        };

        fetchSmokersAndSolicitudes();
    }, []);

    if (loading) {
        return <p className="text-center text-light">Cargando datos...</p>;
    }

    if (error) {
        return <p className="text-center text-danger">{error}</p>;
    }

    if (!store.solicitudes || !store.smoker) {
        return <p className="text-center text-light">Cargando datos...</p>;
    }

    // Filtrar solicitudes aprobadas por el coach que ha iniciado sesión
    const approvedSolicitudes = store.solicitudes.filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null && 
        solicitud.id_coach === store.loggedInCoach.id
    );

    // Extraer los IDs de los smokers aprobados
    const approvedSmokerIds = approvedSolicitudes.map(solicitud => solicitud.id_usuario);

    return (
        <div className="container mt-5 mx-3">
            <h2 className="text-center mb-4 text-light">Clientes Aprobados</h2>
            {approvedSmokerIds.length > 0 ? (
                <div className="row">
                    {store.smoker
                        .filter(smoker => approvedSmokerIds.includes(smoker.id)) // Filtrar smokers aprobados
                        .map(smoker => (
                            <div className="col-md-12 mb-4" key={smoker.id}>
                                <div className="card text-light" style={{ width: "18rem", backgroundColor: "#333" }}>
                                    <img
                                        src={smoker.foto_usuario || "https://via.placeholder.com/150"}
                                        className="card-img-top"
                                        alt={smoker.nombre_usuario || "Imagen no disponible"}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{smoker.nombre_usuario}</h5>
                                        <p className="card-text">
                                            <strong>Género:</strong> {smoker.genero_usuario}
                                        </p>
                                        <p className="card-text">
                                            <strong>Tiempo Fumando:</strong> {smoker.tiempo_fumando}
                                        </p>
                                        <p className="card-text">
                                            <strong>Número de Cigarrillos:</strong> {smoker.numero_cigarrillos}
                                        </p>
                                        <p className="card-text">
                                            <strong>Periodicidad de Consumo:</strong> {smoker.periodicidad_consumo}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            ) : (
                <p className="text-center text-light">No tienes clientes aprobados.</p>
            )}
        </div>
    );
};

export default SmokerCard;
