import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../component/DasboardSmoker/Sidebar";
import Header from "../component/DasboardSmoker/Header";
import { Context } from "../store/appContext"; 
import '../../styles/dashboardsmoker.css';

const UserProfile = () => {
    const { userId } = useParams();
    const { store, actions } = useContext(Context);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

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
                setUserData(data);
                setFormData(data);
            } catch (error) {
                console.error("Error al obtener el perfil del usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleEdit = () => {
        console.log("Entrando al modo de edición");
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        console.log("Saliendo del modo de edición y guardando datos");
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

            const updatedUser = await response.json();
            setUserData(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar el perfil del usuario:", error);
        }
    };

    if (loading) {
        return <p className="text-center text-light">Cargando perfil del usuario...</p>;
    }

    if (!userData) {
        return <p className="text-center text-light">No se pudo cargar el perfil del usuario.</p>;
    }

    return (
        <div className="user-dashboard-container">
            <Sidebar />
            <div className="user-main-layout">
                <Header onLogout={() => actions.logoutsmoker()} />
                <div className="user-main-content">
                    <h2 className="text-center mb-4">Perfil de Usuario</h2>
                    <div className="user-profile-content">
                        {userData.foto_usuario ? (
                            <img src={userData.foto_usuario} alt="Foto de usuario" className="profile-image" />
                        ) : (
                            <p>No se ha subido una foto de perfil.</p>
                        )}
                        <form>
                            <div>
                                <label>Nombre:</label>
                                {isEditing ? (
                                    <input type="text" name="nombre_usuario" value={formData.nombre_usuario || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.nombre_usuario}</p>
                                )}
                            </div>
                            <div>
                                <label>Email:</label>
                                {isEditing ? (
                                    <input type="email" name="email_usuario" value={formData.email_usuario || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.email_usuario}</p>
                                )}
                            </div>
                            <div>
                                <label>Género:</label>
                                {isEditing ? (
                                    <input type="text" name="genero_usuario" value={formData.genero_usuario || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.genero_usuario}</p>
                                )}
                            </div>
                            <div>
                                <label>Fecha de Nacimiento:</label>
                                {isEditing ? (
                                    <input type="date" name="nacimiento_usuario" value={formData.nacimiento_usuario || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.nacimiento_usuario}</p>
                                )}
                            </div>
                            <div>
                                <label>Tiempo Fumando:</label>
                                {isEditing ? (
                                    <input type="text" name="tiempo_fumando" value={formData.tiempo_fumando || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.tiempo_fumando}</p>
                                )}
                            </div>
                            <div>
                                <label>Número de Cigarrillos:</label>
                                {isEditing ? (
                                    <input type="number" name="numero_cigarrillos" value={formData.numero_cigarrillos || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.numero_cigarrillos}</p>
                                )}
                            </div>
                            <div>
                                <label>Periodicidad de Consumo:</label>
                                {isEditing ? (
                                    <input type="text" name="periodicidad_consumo" value={formData.periodicidad_consumo || ''} onChange={handleChange} />
                                ) : (
                                    <p>{userData.periodicidad_consumo}</p>
                                )}
                            </div>
                            {isEditing ? (
                                <button type="button" onClick={handleSaveChanges}>Guardar Cambios</button> // Botón para guardar cambios
                            ) : (
                                <button type="button" onClick={handleEdit}>Editar</button> // Botón para entrar en modo de edición
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
