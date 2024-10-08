import React, { useEffect, useState, useContext } from "react"; // Asegúrate de que useContext está importado
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirección
import { Context } from "../store/appContext"; // Importar el contexto
import "../../styles/CreateProfileCoach.css";

const CreateProfileCoach = () => {
    const { store, actions } = useContext(Context); // Obtener el contexto y las acciones
    const [nombre_coach, setnombre_coach] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [foto_coach, setfoto_coach] = useState(null); // Estado para la imagen
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (store.loggedInCoach) {
            // Si el coach está logueado, carga su información
            setnombre_coach(store.loggedInCoach.nombre_coach || "");
            setGenero(store.loggedInCoach.genero_coach || "masculino");
            if (store.loggedInCoach.nacimiento_coach && typeof store.loggedInCoach.nacimiento_coach === 'string') {
                setCumpleaños(store.loggedInCoach.nacimiento_coach.split("T")[0]);
            }
            setfoto_coach(store.loggedInCoach.foto_coach || null); // Cargar la imagen si existe
        }
    }, [store.loggedInCoach]);

    // Manejar la selección de la imagen
    const handleImageUpload = (e) => {
        setfoto_coach(e.target.files[0]); // Guardar la imagen seleccionada
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Verificar si hay un coach logueado
        if (!store.loggedInCoach) {
            setError("No hay coach logueado. Por favor, inicia sesión.");
            return;
        }

        const coachId = store.loggedInCoach.id; // Obtener el ID del coach

        // Verificar que el ID no sea nulo
        if (!coachId) {
            setError("ID de coach no válido.");
            return;
        }

        // Validar que el cumpleaños no esté vacío
        if (!cumpleaños) {
            setError("La fecha de cumpleaños es requerida.");
            return;
        }

        // Subir la imagen a Cloudinary si se seleccionó una
        let imageUrl = store.loggedInCoach.foto_coach; // Si ya tiene una imagen, se conserva
        if (foto_coach) {
            const uploadResult = await actions.uploadCoachImage(foto_coach); // Subir imagen
            console.log(uploadResult);

            if (uploadResult && uploadResult.secure_url) {
                imageUrl = uploadResult.secure_url; // Usar la URL de la imagen subida
            } else {
                setError("Error al subir la imagen. Inténtalo de nuevo.");
                return;
            }
        }

        const updatedData = {
            nombre_coach: nombre_coach,
            genero_coach: genero,
            nacimiento_coach: cumpleaños,
            foto_coach: imageUrl, // Guardar la URL de la imagen en la base de datos
        };

        console.log("Datos enviados en el perfil:", updatedData);

        // Realizar la actualización del perfil del coach
        const success = await actions.updateProfileCoach(coachId, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/question-address-coach');
        } else {
            alert("Error al actualizar el perfil");
        }
    };

    // Si no hay coach logueado, muestra un mensaje
    if (!store.loggedInCoach) {
        return <div>No hay coach logueado. Por favor, inicia sesión.</div>;
    }

    return (
        <>
            <div className="profile-form">
                <h2>Actualizar Perfil de Coach</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre de Coach:</label>
                        <input
                            type="text"
                            value={nombre_coach}
                            onChange={(e) => setnombre_coach(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Género:</label>
                        <select
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                            required
                        >
                            <option value="masculino">Masculino</option>
                            <option value="femenino">Femenino</option>
                        </select>
                    </div>
                    <div>
                        <label>Cumpleaños:</label>
                        <input
                            type="date"
                            value={cumpleaños}
                            onChange={(e) => setCumpleaños(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Foto de Perfil:</label>
                        <input
                            type="file"
                            onChange={handleImageUpload}
                        />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit">Actualizar Perfil</button>
                </form>
            </div>
            <button
                className="back-button"
                onClick={() => navigate(-1)} // Navegar hacia atrás
            >
                Volver Atrás
            </button>
        </>
    );
};

export default CreateProfileCoach;
