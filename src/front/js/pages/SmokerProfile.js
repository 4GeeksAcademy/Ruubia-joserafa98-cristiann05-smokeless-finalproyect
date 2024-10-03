// src/pages/SmokerProfile.js

import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const SmokerProfile = () => {
    const { store, actions } = useContext(Context);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editableSmoker, setEditableSmoker] = useState({
        nombre_usuario: "",
        email_usuario: "",
        genero_usuario: "",
        nacimiento_usuario: "",
        numerocigarro_usuario: "",
        periodicidad: "",
        tiempo_fumando: "",
        foto_usuario: ""
    });

    useEffect(() => {
        const smokerId = store.smokerId; // Asegúrate de que smokerId esté almacenado en el store
        if (smokerId) {
            actions.getSmoker(smokerId); // Asegúrate de que esta acción esté implementada
        }
    }, [actions, store.smokerId]);

    useEffect(() => {
        // Establecer el smoker editable cuando se obtiene el smoker
        if (store.selectedSmoker) {
            setEditableSmoker(store.selectedSmoker);
        }
    }, [store.selectedSmoker]);

    const handleImageUpload = async (event) => {
        event.preventDefault();

        if (!imageFile) {
            setError("Por favor selecciona un archivo de imagen.");
            return;
        }

        try {
            const success = await actions.uploadSmokerImage(imageFile); // Asegúrate de que esta acción esté implementada
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
        setEditableSmoker({ ...editableSmoker, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await actions.updateSmoker(editableSmoker.id, editableSmoker); // Pasa el smokerId y los datos actualizados
            if (response) {
                setSuccess("Información actualizada exitosamente.");
            }
        } catch (error) {
            setError("Error al actualizar la información: " + error.message);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Perfil del Smoker</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {editableSmoker ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre_usuario"
                            value={editableSmoker.nombre_usuario || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email_usuario"
                            value={editableSmoker.email_usuario || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Género</label>
                        <input
                            type="text"
                            className="form-control"
                            name="genero_usuario"
                            value={editableSmoker.genero_usuario || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            className="form-control"
                            name="nacimiento_usuario"
                            value={editableSmoker.nacimiento_usuario || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Número de Cigarros al Día</label>
                        <input
                            type="number"
                            className="form-control"
                            name="numerocigarro_usuario"
                            value={editableSmoker.numerocigarro_usuario || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Periodicidad</label>
                        <input
                            type="text"
                            className="form-control"
                            name="periodicidad"
                            value={editableSmoker.periodicidad || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Tiempo Fumando</label>
                        <input
                            type="text"
                            className="form-control"
                            name="tiempo_fumando"
                            value={editableSmoker.tiempo_fumando || ""}
                            onChange={handleChange}
                        />
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
                <p>Cargando información del smoker...</p>
            )}
        </div>
    );
};

export default SmokerProfile;
