import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const CoachCard = () => {
    const { store, actions } = useContext(Context); 

    useEffect(() => {
        actions.getAllCoaches(); 
        console.log(store.coaches)
    }, []);

    return (
        <div className="container mt-5">
    <h1 className="text-center mb-4">Coachs Disponibles</h1>
    {store.coaches && store.coaches.length > 0 ? (
        <div className="row g-4">
            {store.coaches.map((coach) => (
                <div className="col-md-4" key={coach.id}>
                    <div className="card text-dark" style={{ width: "18rem" }}>
                        <img
                            src={coach.foto_coach || "default_image_url.jpg"}
                            className="card-img-top"
                            alt={coach.nombre_coach || "Imagen no disponible"}
                        />
                        <div className="card-body">
                            <h5 className="card-title text-dark">{coach.nombre_coach}</h5>
                            <p className="card-text text-dark">
                                <strong>Género:</strong> {coach.genero_coach}
                            </p>
                            <p className="card-text text-dark">
                                <strong>¿Quién soy?:</strong> {coach.descripcion_coach}
                            </p>
                            <p className="card-text text-dark">
                                <strong>Dirección:</strong> {coach.direccion}
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

    )
}
export default CoachCard     
