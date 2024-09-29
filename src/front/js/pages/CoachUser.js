import React, { useContext, useEffect, useState } from "react"; 
import { Context } from "../store/appContext";

const CoachUser = () => {
    const { store, actions } = useContext(Context);
    const { coaches } = store;
    const [coachToEdit, setCoachToEdit] = useState(null);
    
    // Datos por defecto que deseas establecer
    const defaultData = {
        direccion: "Dirección predeterminada",
        latitud: 0.0,
        longitud: 0.0,
        descripcion_coach: "Descripción predeterminada",
        foto_coach: "url-de-la-foto-predeterminada",
        precio_servicio: 50.0,
    };

    const [formData, setFormData] = useState({
        email_coach: "",
        nombre_coach: "",
        password_coach: "",
        genero_coach: "",
        ...defaultData,
    });

    useEffect(() => {
        // Función para obtener coaches
        const fetchCoaches = async () => {
            await actions.getCoaches();
        };

        // Obtener coaches al montar el componente
        fetchCoaches();

        // Establecer polling cada 5 segundos (5000 ms)
        const interval = setInterval(() => {
            fetchCoaches();
        }, 5000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, [actions]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email_coach || !formData.nombre_coach || !formData.password_coach || !formData.genero_coach) {
            console.error("Por favor, completa todos los campos requeridos.");
            return;
        }

        console.log("Datos a enviar:", formData);

        if (coachToEdit) {
            await actions.updateCoach(coachToEdit.id, formData);
        } else {
            await actions.createCoach(formData);
        }
        resetForm();
    };

    const handleEdit = (coach) => {
        setCoachToEdit(coach);
        setFormData({
            email_coach: coach.email_coach,
            nombre_coach: coach.nombre_coach,
            password_coach: "", // No llenamos la contraseña por razones de seguridad
            genero_coach: coach.genero_coach,
            ...defaultData,
        });
    };

    const handleDelete = async (coachId) => {
        await actions.deleteCoach(coachId);
    };

    const resetForm = () => {
        setCoachToEdit(null);
        setFormData({
            email_coach: "",
            nombre_coach: "",
            password_coach: "",
            genero_coach: "",
            ...defaultData,
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
                                <label htmlFor="password_coach">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password_coach"
                                    name="password_coach"
                                    value={formData.password_coach}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="genero_coach">Género</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="genero_coach"
                                    name="genero_coach"
                                    value={formData.genero_coach}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-none">
                            <input type="text" name="direccion" value={formData.direccion} readOnly />
                            <input type="number" name="latitud" value={formData.latitud} readOnly />
                            <input type="number" name="longitud" value={formData.longitud} readOnly />
                            <textarea name="descripcion_coach" value={formData.descripcion_coach} readOnly></textarea>
                            <input type="text" name="foto_coach" value={formData.foto_coach} readOnly />
                            <input type="number" name="precio_servicio" value={formData.precio_servicio} readOnly />
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
                            <th scope="col">Género</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coaches.map(coach => (
                            <tr key={coach.id}>
                                <td>{coach.nombre_coach}</td>
                                <td>{coach.email_coach}</td>
                                <td>{coach.genero_coach}</td>
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
