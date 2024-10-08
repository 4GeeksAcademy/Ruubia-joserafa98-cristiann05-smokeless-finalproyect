import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext";

const ApprovedCoaches = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApprovedCoaches = async () => {
            try {
                await actions.getAllSolicitudes(); // Cargar las solicitudes
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener las solicitudes:", error);
                setError("No se pudieron obtener las solicitudes.");
                setLoading(false);
            }
        };

        fetchApprovedCoaches();
    }, [actions]);

    
    const approvedSolicitudes = store.solicitudes.filter(solicitud => 
        solicitud.estado === true && 
        solicitud.fecha_respuesta !== null && // Solo aquellas que tienen fecha de respuesta
        solicitud.id_usuario === store.loggedInUser.id
    );

    // Extraer los IDs de los coaches aprobados
    const approvedCoachIds = approvedSolicitudes.map(solicitud => solicitud.id_coach);

    return (
        <div className="container mt-5 mx-3">
            <h2 className="text-center mb-4 text-light">Coaches Aprobados</h2>
            {loading ? (
                <p className="text-center text-light">Cargando datos...</p> 
            ) : error ? (
                <p className="text-center text-danger">{error}</p> 
            ) : approvedCoachIds.length > 0 ? (
                <div className="row">
                    {store.coaches
                        .filter(coach => approvedCoachIds.includes(coach.id)) // Filtrar los coaches aprobados
                        .map(coach => (
                            <div className="col-md-12 mb-4" key={coach.id}>
                                <div className="card text-light" style={{ width: "18rem", backgroundColor: "#333" }}>
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
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            ) : (
                <p className="text-center text-light">No tienes coaches aprobados.</p>
            )}
        </div>
    );
};

export default ApprovedCoaches;
