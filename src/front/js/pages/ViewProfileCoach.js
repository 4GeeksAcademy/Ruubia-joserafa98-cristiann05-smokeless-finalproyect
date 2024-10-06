import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext"; 
import { useContext } from "react";

const CoachDetails = () => {
    const { coachId } = useParams(); // Extraer el coachId de la URL
    const { actions } = useContext(Context); 
    const [coach, setCoach] = useState(null); 

    useEffect(() => {
        const fetchCoachData = async () => {
            try {
                const coachData = await actions.getCoach(coachId); // Usa coachId para la solicitud
                setCoach(coachData);
            } catch (error) {
                console.error("Error fetching coach:", error);
            }
        };

        fetchCoachData();
    }, [coachId, actions]);

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Detalles del Coach</h2>
            {loading ? (
                <p className="text-center">Cargando datos del coach...</p>
            ) : coachData ? (
                <div className="card">
                    <img src={coachData.foto_coach} alt="Foto del Coach" className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">{coachData.nombre_coach || 'Nombre no disponible'}</h5>
                        <p className="card-text"><strong>Email:</strong> {coachData.email_coach}</p>
                        <p className="card-text"><strong>Género:</strong> {coachData.genero_coach || 'No especificado'}</p>
                        <p className="card-text"><strong>Fecha de Nacimiento:</strong> {coachData.nacimiento_coach || 'No disponible'}</p>
                        <p className="card-text"><strong>Dirección:</strong> {coachData.direccion || 'No disponible'}</p>
                        <p className="card-text"><strong>Latitud:</strong> {coachData.latitud || 'No disponible'}</p>
                        <p className="card-text"><strong>Longitud:</strong> {coachData.longitud || 'No disponible'}</p>
                        <p className="card-text"><strong>Descripción:</strong> {coachData.descripcion_coach || 'No disponible'}</p>
                        <p className="card-text"><strong>Precio del Servicio:</strong> {coachData.precio_servicio ? `$${coachData.precio_servicio}` : 'No disponible'}</p>
                    </div>
                </div>
            ) : (
                <p className="text-center">No se encontraron datos del coach.</p>
            )}
        </div>
    );
};

export default CoachDetails;
