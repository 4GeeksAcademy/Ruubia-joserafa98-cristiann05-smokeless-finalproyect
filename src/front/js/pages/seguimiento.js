import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const FollowingList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        // Verificar si existe userId para obtener los seguimientos
        if (store.userId) {
            actions.getFollowing(store.userId);
        }
    }, [store.userId, actions]); // Dependencias para el useEffect

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Este es tu progreso</h1>
            {store.seguimiento && store.seguimiento.length > 0 ? ( // Usar la propiedad seguimiento del store
                <div className="row">
                    {store.seguimiento.map(following => (
                        <div className="col-md-4 mb-4" key={following.id}>
                            <div className="card" style={{ width: "18rem" }}>
                                <img
                                    src={following.foto_usuario || "default_image_url.jpg"}
                                    className="card-img-top"
                                    alt={following.nombre_usuario || "Imagen no disponible"}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{following.nombre_usuario}</h5>
                                    <p className="card-text">
                                        <strong>Cantidad de consumo:</strong> {following.numerocigarro_usuario} {following.periodicidad}
                                    </p>
                                    <p className="card-text">
                                        <strong>Sustancia:</strong> {following.tipo_consumo?.nombre || "Desconocido"}
                                    </p>
                                    <a href="#" className="btn btn-primary">Ver Detalles</a>
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
};

export default FollowingList;

