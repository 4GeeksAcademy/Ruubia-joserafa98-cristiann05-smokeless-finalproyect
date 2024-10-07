import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    const { userId } = useParams(); // Obtener el userId de la URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Manejar estado de carga

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/smoker/${userId}`, {
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
                setUserData(data); // Guardar los datos obtenidos en el estado
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoading(false); // Dejar de mostrar el estado de carga
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return <p>Cargando perfil del usuario...</p>; // Mostrar un mensaje mientras se cargan los datos
    }

    if (!userData) {
        return <p>No se pudo cargar el perfil del usuario.</p>; // Manejar errores
    }

    return (
        <div className="user-profile">
            <h2>Perfil de Usuario</h2>
            {userData.foto_usuario ? (
                <img src={userData.foto_usuario} alt="Foto de usuario" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
            ) : (
                <p>No se ha subido una foto de perfil.</p>
            )}
            <p><strong>Nombre:</strong> {userData.nombre_usuario}</p>
            <p><strong>Email:</strong> {userData.email_usuario}</p>
            <p><strong>Género:</strong> {userData.genero_usuario}</p>
            <p><strong>Fecha de Nacimiento:</strong> {userData.nacimiento_usuario}</p>
            <p><strong>Tiempo Fumando:</strong> {userData.tiempo_fumando}</p>
            <p><strong>Número de Cigarrillos:</strong> {userData.numero_cigarrillos}</p>
            <p><strong>Periodicidad de Consumo:</strong> {userData.periodicidad_consumo}</p>
        </div>
    );
};

export default UserProfile;

