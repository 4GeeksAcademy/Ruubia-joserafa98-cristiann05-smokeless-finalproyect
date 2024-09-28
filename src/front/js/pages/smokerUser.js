import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const SmokerUser = () => {
    const { store, actions } = useContext(Context);
    const { smokers } = store;
    const [smokerToEdit, setSmokerToEdit] = useState(null);
    const [formData, setFormData] = useState({
        email_usuario: "",
        password_email: "",
        nombre_usuario: "",
        genero_usuario: "",
        nacimiento_usuario: "",
        numerocigarro_usuario: 0,
        periodicidad: "",
        tiempo_fumando: "",
        id_tipo: 1,
    });

    useEffect(() => {
        actions.getSmokers(); // Obtener la lista de fumadores al cargar el componente
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
        if (smokerToEdit) {
            actions.updateSmoker(smokerToEdit.id, formData); // Editar un fumador existente
        } else {
            actions.createSmoker(formData); // Crear un nuevo fumador
        }
        resetForm();
    };

    const handleEdit = (smoker) => {
        setSmokerToEdit(smoker);
        setFormData(smoker);
    };

    const handleDelete = (smokerId) => {
        actions.deleteSmoker(smokerId); // Eliminar un fumador
    };

    const resetForm = () => {
        setSmokerToEdit(null);
        setFormData({
            email_usuario: "",
            password_email: "",
            nombre_usuario: "",
            genero_usuario: "",
            nacimiento_usuario: "",
            numerocigarro_usuario: 0,
            periodicidad: "",
            tiempo_fumando: "",
            id_tipo: 1,
        });
    };

    return (
        <div className="container mt-5 d-flex flex-column align-items-center">
            <h1 className="text-center mb-4">Gestión de Fumadores</h1>
            <div className="card mb-4" style={{ width: "80%" }}>
                <div className="card-body">
                    <h3 className="card-title text-center">{smokerToEdit ? "Editar Fumador" : "Agregar Fumador"}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nombre_usuario">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre_usuario"
                                    name="nombre_usuario"
                                    value={formData.nombre_usuario}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="email_usuario">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email_usuario"
                                    name="email_usuario"
                                    value={formData.email_usuario}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="password_email">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password_email"
                                    name="password_email"
                                    value={formData.password_email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="genero_usuario">Género</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="genero_usuario"
                                    name="genero_usuario"
                                    value={formData.genero_usuario}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="nacimiento_usuario">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="nacimiento_usuario"
                                    name="nacimiento_usuario"
                                    value={formData.nacimiento_usuario}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="numerocigarro_usuario">Número de Cigarros</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="numerocigarro_usuario"
                                    name="numerocigarro_usuario"
                                    value={formData.numerocigarro_usuario}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="periodicidad">Periodicidad</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="periodicidad"
                                    name="periodicidad"
                                    value={formData.periodicidad}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="tiempo_fumando">Tiempo Fumando</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tiempo_fumando"
                                    name="tiempo_fumando"
                                    value={formData.tiempo_fumando}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {smokerToEdit ? "Actualizar" : "Agregar"}
                        </button>
                        <button type="button" onClick={resetForm} className="btn btn-secondary ml-2">Cancelar</button>
                    </form>
                </div>
            </div>

            <h3 className="mb-3 text-center">Lista de Fumadores</h3>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Email</th>
                            <th scope="col">Género</th>
                            <th scope="col">Fecha de Nacimiento</th>
                            <th scope="col">Número de Cigarros</th>
                            <th scope="col">Periodicidad</th>
                            <th scope="col">Tiempo Fumando</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {smokers.map(smoker => (
                            <tr key={smoker.id}>
                                <td>{smoker.nombre_usuario}</td>
                                <td>{smoker.email_usuario}</td>
                                <td>{smoker.genero_usuario}</td>
                                <td>{smoker.nacimiento_usuario}</td>
                                <td>{smoker.numerocigarro_usuario}</td>
                                <td>{smoker.periodicidad}</td>
                                <td>{smoker.tiempo_fumando}</td>
                                <td className="text-center">
                                    <button onClick={() => handleEdit(smoker)} className="btn btn-warning btn-sm mr-2">Editar</button>
                                    <button onClick={() => handleDelete(smoker.id)} className="btn btn-danger btn-sm">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SmokerUser;
