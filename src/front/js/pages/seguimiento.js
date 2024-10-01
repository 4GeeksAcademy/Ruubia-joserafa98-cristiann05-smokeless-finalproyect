import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const FollowingList = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        const fetchFollowingData = async () => {
            if (store.userId) {
                await actions.getFollowing(store.userId); // Llama a la acción para obtener los datos de seguimiento
            }
        };

        fetchFollowingData();
    }, [store.userId, actions]);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Este es tu progreso</h1>
            {store.seguimiento && store.seguimiento.length > 0 ? ( // Asegúrate de que este valor esté disponible en el store
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









