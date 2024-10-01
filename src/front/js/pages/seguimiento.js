import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const FollowingList = () => {
    const { store } = useContext(Context);

    useEffect(() => {
        if (!store.userId) {
            console.log("No hay datos de consumo para mostrar.");
        }
    }, [store.userId]);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Este es tu progreso</h1>
            {store.userId ? (
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card" style={{ width: "18rem" }}>
                            <img
                                src={store.fotoUsuario || "default_image_url.jpg"}
                                className="card-img-top"
                                alt={store.nombreUsuario || "Imagen no disponible"}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{store.nombreUsuario}</h5>
                                <p className="card-text">
                                    <strong>Cantidad de consumo:</strong> {store.numerocigarro_usuario} {store.periodicidad}
                                </p>
                                <p className="card-text">
                                    <strong>Sustancia:</strong> {store.tipo_consumo?.nombre || "Desconocido"}
                                </p>
                                <a href="#" className="btn btn-primary">Ver Detalles</a>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center">No hay datos registrados.</p>
            )}
        </div>
    );
};

export default FollowingList;







