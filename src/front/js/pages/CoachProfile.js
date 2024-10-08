import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CoachProfile = () => {
    const { coachId } = useParams(); // Obtener el coachId de la URL
    const [coachData, setCoachData] = useState(null);
    const [loading, setLoading] = useState(true); // Manejar estado de carga

    useEffect(() => {
        const fetchCoachProfile = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setCoachData(data); // Guardar los datos obtenidos en el estado
            } catch (error) {
                console.error("Error al obtener el perfil del coach:", error);
            } finally {
                setLoading(false); // Dejar de mostrar el estado de carga
            }
        };

        fetchCoachProfile();
    }, [coachId]);

    if (loading) {
        return <p>Cargando perfil del coach...</p>; // Mostrar un mensaje mientras se cargan los datos
    }

    if (!coachData) {
        return <p>No se pudo cargar el perfil del coach.</p>; // Manejar errores
    }

    return (
        <div className="coach-profile">
            <h2>Perfil de Coach</h2>
            {coachData.foto_coach ? (
                <img src={coachData.foto_coach} alt="Foto de coach" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            ) : (
                <p>No se ha subido una foto de perfil.</p>
            )}
            <p><strong>Nombre:</strong> {coachData.nombre_coach}</p>
            <p><strong>Email:</strong> {coachData.email_coach}</p>
            <p><strong>Género:</strong> {coachData.genero_coach}</p>
            <p><strong>Fecha de Nacimiento:</strong> {coachData.nacimiento_coach}</p>
            <p><strong>Dirección:</strong> {coachData.direccion}</p>
            <p><strong>Latitud:</strong> {coachData.latitud}</p>
            <p><strong>Longitud:</strong> {coachData.longitud}</p>
            <p><strong>Descripción:</strong> {coachData.descripcion_coach}</p>
            <p><strong>Precio del Servicio:</strong> {coachData.precio_servicio !== null ? `$${coachData.precio_servicio.toFixed(2)}` : "No disponible"}</p>
        </div>
    );
};

export default CoachProfile;
