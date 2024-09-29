import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const CoachUser = () => {
    const { store, actions } = useContext(Context);
    const { coaches } = store; // Obtenemos los datos de los coaches desde el store
    const [coachToEdit, setCoachToEdit] = useState(null);
    const [formData, setFormData] = useState({
        email_coach: "",
        nombre_coach: "",
        especialidad: "",
        experiencia: "",
    });

    useEffect(() => {
        actions.getCoaches(); // Llama a la acción para obtener los datos de los coaches
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (coachToEdit) {
            actions.updateCoach(coachToEdit.id, formData); // Actualiza el coach existente
        } else {
            actions.createCoach(formData); // Crea un nuevo coach
        }
        resetForm();
    };

    const handleEdit = (coach) => {
        setCoachToEdit(coach);
        setFormData(coach);
    };

    const handleDelete = (coachId) => {
        actions.deleteCoach(coachId); // Elimina el coach
    };

    const resetForm = () => {
        setCoachToEdit(null);
        setFormData({
            email_coach: "",
            nombre_coach: "",
            especialidad: "",
            experiencia: "",
        });
    };

    return (
        <div className="container mt-5 d-flex flex-column align-items-center">
            <h1 className="text-center mb-4">Gestión de Coaches</h1>
            <div className="card mb-4" style={{ width: "80%" }}>
                <div className="card-body">
                    <h3 className="card-title text-center">{coachToEdit ? "Editar Coach" : "Agregar Coach"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nombre_coach">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre_coach"
                                    name="nombre_coach"
                                    value={formData.nombre_coach}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="email_coach">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email_coach"
                                    name="email_coach"
                                    value={formData.email_coach}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="especialidad">Especialidad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="especialidad"
                                    name="especialidad"
                                    value={formData.especialidad}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="experiencia">Años de experiencia</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="experiencia"
                                    name="experiencia"
                                    value={formData.experiencia}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            {coachToEdit ? "Actualizar" : "Agregar"}
                        </button>
                        <button type="button" onClick={resetForm} className="btn btn-secondary ml-2">Cancelar</button>
                    </form>
                </div>
            </div>

            <h3 className="mb-3 text-center">Lista de Coaches</h3>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Especialidad</th>
                            <th scope="col">Años de Experiencia</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coaches.map(coach => (
                            <tr key={coach.id}>
                                <td>{coach.nombre_coach}</td>
                                <td>{coach.email_coach}</td>
                                <td>{coach.especialidad}</td>
                                <td>{coach.experiencia}</td>
                                <td className="text-center">
                                    <button className="btn btn-warning" onClick={() => handleEdit(coach)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(coach.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CoachUser;
