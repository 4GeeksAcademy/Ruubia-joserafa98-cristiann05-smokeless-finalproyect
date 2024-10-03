import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const CoachProfile = () => {
    const { store, actions } = useContext(Context);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editableCoach, setEditableCoach] = useState({
        nombre_coach: "",
        email_coach: "",
        genero_coach: "",
        direccion: "",
        descripcion_coach: ""
    });

    useEffect(() => {
        const coachId = store.coachId; // Asegúrate de que coachId esté almacenado en el store
        if (coachId) {
            actions.getCoach(coachId);
        }
    }, [actions, store.coachId]);

    useEffect(() => {
        // Establecer el coach editable cuando se obtiene el coach
        if (store.selectedCoach) {
            setEditableCoach(store.selectedCoach);
        }
    }, [store.selectedCoach]);

    const handleImageUpload = async (event) => {
        event.preventDefault();

        if (!imageFile) {
            setError("Por favor selecciona un archivo de imagen.");
            return;
        }

        try {
            const success = await actions.uploadCoachImage(imageFile);
            if (success) {
                setSuccess("Imagen subida exitosamente.");
            } else {
                setError("Error al subir la imagen. Intenta de nuevo.");
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableCoach({ ...editableCoach, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await actions.updateCoach(editableCoach.id, editableCoach); // Pasa el coachId y los datos actualizados
            if (response) {
                setSuccess("Información actualizada exitosamente.");
            }
        } catch (error) {
            setError("Error al actualizar la información: " + error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Perfil del Coach</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {editableCoach ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre_coach"
                            value={editableCoach.nombre_coach || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email_coach"
                            value={editableCoach.email_coach || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Género</label>
                        <input
                            type="text"
                            className="form-control"
                            name="genero_coach"
                            value={editableCoach.genero_coach || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={editableCoach.direccion || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            className="form-control"
                            name="descripcion_coach"
                            value={editableCoach.descripcion_coach || ""}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Imagen de Perfil</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                    <button type="button" className="btn btn-secondary mt-3" onClick={handleImageUpload}>
                        Subir Imagen
                    </button>
                    <button type="submit" className="btn btn-primary mt-3">
                        Actualizar Información
                    </button>
                </form>
            ) : (
                <p>Cargando información del coach...</p>
            )}
        </div>
    );
};

export default CoachProfile;
