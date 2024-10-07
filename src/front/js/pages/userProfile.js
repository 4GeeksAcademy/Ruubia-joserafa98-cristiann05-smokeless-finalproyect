import React, { useEffect, useState } from "react";

const UserProfile = () => {
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        console.log("User ID:", userId); // Agregar console.log para verificar el ID

        if (!userId) {
            console.error("No se encontró el user_id en localStorage.");
            return; // Salir si userId es null
        }

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
                    throw new Error("Error en la respuesta de la API: " + response.statusText);
                }

                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

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
