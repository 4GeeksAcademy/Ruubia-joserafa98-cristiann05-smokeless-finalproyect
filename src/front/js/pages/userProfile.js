import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserProfile = () => {
    const { userId } = useParams(); // Obtener el userId de la URL
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Manejar estado de carga
    const [isEditing, setIsEditing] = useState(false); // Estado para manejar el modo de edición
    const [formData, setFormData] = useState({}); // Estado para el formulario de edición
    const [message, setMessage] = useState(""); // Estado para mensajes de éxito/error

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
                setFormData(data); // Inicializa formData con los datos del usuario
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoading(false); // Dejar de mostrar el estado de carga
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/smoker/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const updatedData = await response.json();
            setUserData(updatedData);
            setMessage("Perfil actualizado exitosamente!");
        } catch (error) {
            console.error("Error al actualizar el perfil del usuario:", error);
            setMessage("Error al actualizar el perfil.");
        } finally {
            setIsEditing(false); // Salir del modo de edición
        }
    };

    if (loading) {
        return <p>Cargando perfil del usuario...</p>; // Mostrar un mensaje mientras se cargan los datos
    }

    if (!userData) {
        return <p>No se pudo cargar el perfil del usuario.</p>; // Manejar errores
    }

    return (
        <div className="user-profile">
            <h2>Perfil de Usuario</h2>
            {message && <p>{message}</p>}
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    {userData.foto_usuario ? (
                        <img src={userData.foto_usuario} alt="Foto de usuario" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                    ) : (
                        <p>No se ha subido una foto de perfil.</p>
                    )}
                    <div>
                        <label>Nombre:</label>
                        <input type="text" name="nombre_usuario" value={formData.nombre_usuario || ''} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email_usuario" value={formData.email_usuario || ''} readOnly />
                    </div>
                    <div>
                        <label>Género:</label>
                        <input type="text" name="genero_usuario" value={formData.genero_usuario || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" name="nacimiento_usuario" value={formData.nacimiento_usuario || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Tiempo Fumando:</label>
                        <input type="text" name="tiempo_fumando" value={formData.tiempo_fumando || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Número de Cigarrillos:</label>
                        <input type="number" name="numero_cigarrillos" value={formData.numero_cigarrillos || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Periodicidad de Consumo:</label>
                        <input type="text" name="periodicidad_consumo" value={formData.periodicidad_consumo || ''} onChange={handleChange} />
                    </div>
                    <button type="submit">Actualizar Perfil</button>
                </form>
            ) : (
                <>
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
                    <button onClick={handleEditClick}>Editar Perfil</button>
                </>
            )}
        </div>
    );
};

export default UserProfile;
