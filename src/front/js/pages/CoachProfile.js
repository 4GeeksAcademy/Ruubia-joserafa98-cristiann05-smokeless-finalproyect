import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CoachProfile = () => {
    const { coachId } = useParams();
    const [coachData, setCoachData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({}); // Estado para el formulario de edición
    const [message, setMessage] = useState(""); // Estado para mensajes de éxito/error

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
                setCoachData(data);
                setFormData(data); // Inicializa formData con los datos del coach
            } catch (error) {
                console.error("Error al obtener el perfil del coach:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoachProfile();
    }, [coachId]);

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
            const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
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
            setCoachData(updatedData);
            setMessage("Perfil actualizado exitosamente!");
        } catch (error) {
            console.error("Error al actualizar el perfil del coach:", error);
            setMessage("Error al actualizar el perfil.");
        } finally {
            setIsEditing(false);
        }
    };

    if (loading) {
        return <p>Cargando perfil del coach...</p>;
    }

    if (!coachData) {
        return <p>No se pudo cargar el perfil del coach.</p>;
    }

    return (
        <div className="coach-profile">
            <h2>Perfil de Coach</h2>
            {message && <p>{message}</p>}
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    {coachData.foto_coach ? (
                        <img src={coachData.foto_coach} alt="Foto de coach" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                    ) : (
                        <p>No se ha subido una foto de perfil.</p>
                    )}
                    <div>
                        <label>Nombre:</label>
                        <input type="text" name="nombre_coach" value={formData.nombre_coach || ''} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email_coach" value={formData.email_coach || ''} readOnly />
                    </div>
                    <div>
                        <label>Género:</label>
                        <input type="text" name="genero_coach" value={formData.genero_coach || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Fecha de Nacimiento:</label>
                        <input type="date" name="nacimiento_coach" value={formData.nacimiento_coach || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Dirección:</label>
                        <input type="text" name="direccion" value={formData.direccion || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Descripción:</label>
                        <textarea name="descripcion_coach" value={formData.descripcion_coach || ''} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Precio del Servicio:</label>
                        <input type="number" name="precio_servicio" value={formData.precio_servicio || ''} onChange={handleChange} step="0.01" />
                    </div>
                    <button type="submit">Actualizar Perfil</button>
                </form>
            ) : (
                <>
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
                    <button onClick={handleEditClick}>Editar Perfil</button>
                </>
            )}
        </div>
    );
};

export default CoachProfile;
