import React, { useEffect, useState, useContext, useRef } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { Context } from "../store/appContext"; 
import "../../styles/CreateProfileCoach.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Asegúrate de que este CSS esté importado
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const CreateProfileCoach = () => {
    const { store, actions } = useContext(Context); 
    const [nombre_coach, setnombre_coach] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [urlImagen, setUrlImagen] = useState("");  // Para guardar la URL de la imagen subida
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);  // Para el input de archivo

    useEffect(() => {
        if (store.loggedInCoach) {
            setnombre_coach(store.loggedInCoach.nombre_coach || "");
            setGenero(store.loggedInCoach.genero_coach || "masculino");
            if (store.loggedInCoach.nacimiento_coach && typeof store.loggedInCoach.nacimiento_coach === 'string') {
                setCumpleaños(store.loggedInCoach.nacimiento_coach.split("T")[0]);
            }
            setUrlImagen(store.loggedInCoach.public_id || "");  // Asignar el public_id si existe
        }
    }, [store.loggedInCoach]);

    
    // Función para subir la imagen a Cloudinary
    const changeUploadImage = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "Presents_react");
        data.append("cloud_name", "dhieuyort");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dhieuyort/image/upload", {
                method: "POST",
                body: data
            });

            const result = await response.json();
            if (response.ok) {
                setUrlImagen(result.secure_url);
                localStorage.setItem("profileImageUrlCoach", result.secure_url); // Guardar en localStorage con el nuevo nombre
            } else {
                setError("Error al subir la imagen. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            setError("Error al subir la imagen. Inténtalo nuevamente.");
        }
    };

    const handleDeleteImage = () => {
        setUrlImagen("");
        fileInputRef.current.value = "";
    };

    const isAdult = (birthdate) => {
        const today = new Date();
        return birthdate <= today.setFullYear(today.getFullYear() - 18); // Verificar si el usuario es mayor de 18
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        if (!store.loggedInCoach) {
            setError("No hay coach logueado. Por favor, inicia sesión.");
            return;
        }
    
        const coachId = store.loggedInCoach.id;
    
        if (!coachId) {
            setError("ID de coach no válido.");
            return;
        }
    
        // Validar que el usuario sea mayor de edad
        if (!isAdult(cumpleaños)) {
            setError("Debes ser mayor de 18 años para registrarte.");
            return;
        }
    
        // Formatear la fecha antes de enviarla
        const formattedDate = cumpleaños instanceof Date ? 
            cumpleaños.toISOString().split('T')[0] : // formato YYYY-MM-DD
            cumpleaños;
    
        // Enviar los datos actualizados
        const updatedData = {
            nombre_coach: nombre_coach,
            genero_coach: genero,
            nacimiento_coach: formattedDate, // Usar la fecha formateada aquí
            public_id: urlImagen,
        };
    
        const success = await actions.updateProfileCoach(coachId, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/question-address-coach');
        } else {
            alert("Error al actualizar el perfil");
        }
    };
    

    if (!store.loggedInCoach) {
        return <div>No hay coach logueado. Por favor, inicia sesión.</div>;
    }

    return (
        <>
            <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
                <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
                    <div className="p-12 py-xl-10 px-xl-20">
                        <div className="d-block">
                            <img src={logo} alt="Logo" className="logo" />
                        </div>
    
                        <div className="mt-16 text-center px-5">
                            <h1 className="ls-tight fw-bolder display-4 text-white mb-3">
                                ¡Cuéntanos más de ti!
                            </h1>
                            <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                                Ayúdanos a conocerte mejor. Estos detalles básicos harán que tu experiencia sea única y personalizada en cada paso del camino.
                            </p>
                        </div>
                    </div>
                </div>
    
                <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
                    <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
                        <div className="mb-10">
                            <a className="d-inline-block d-lg-none mb-10" href="/pages/dashboard.html">
                                <img src={logoOscuro} alt="Logo Oscuro" className="logo" />
                            </a>
                            <h1 className="ls-tight fw-bolder h1">Actualizar Perfil</h1> 
                        </div>
    
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        <form className="form" onSubmit={handleSubmit} style={{ fontSize: '1.25rem' }}>
                            {/* Nombre */}
                            <div className="group mb-4">
                                <i className="fa-regular fa-user icon"></i>
                                <input
                                    type="text"
                                    name="nombre_coach"
                                    id="nombre_coach"
                                    className="input"
                                    value={nombre_coach}
                                    onChange={(e) => setnombre_coach(e.target.value)}
                                    placeholder="Nombre de Coach"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>
    
                            {/* Género */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-venus-mars icon"></i>
                                <select
                                    name="genero"
                                    id="genero"
                                    className="input"
                                    value={genero}
                                    onChange={(e) => setGenero(e.target.value)}
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                >
                                    <option value="" disabled>Seleccionar Género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                </select>
                            </div>
    
                            {/* Fecha de nacimiento */}
                            <div className="group mb-4 position-relative">
                                <i className="fa-regular fa-calendar icon"></i>
                                <DatePicker
                                    selected={cumpleaños}
                                    onChange={(date) => setCumpleaños(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="input"
                                    required
                                    placeholderText="Fecha de Cumpleaños"
                                    maxDate={new Date()}
                                    showYearDropdown
                                    yearDropdownItemNumber={100}
                                    scrollableYearDropdown
                                    style={{ height: '60px', fontSize: '1.25rem', paddingLeft: '40px' }} // Añadir padding para el ícono
                                />
                            </div>
    
                            {/* Foto */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-camera icon"></i>
                                <input
                                    id="file-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={changeUploadImage}
                                    className="input"
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>

                            {/* Mostrar la imagen subida */}
                            {urlImagen && (
                                <div className="mb-4 text-center">
                                    <img src={urlImagen} alt="Imagen subida" width="200px" className="img-thumbnail" />
                                    <button type="button" className="btn btn-danger mt-2" onClick={handleDeleteImage}>Eliminar Imagen</button>
                                </div>
                            )}
    
                            {/* Botón de guardar */}
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary w-100" style={{ height: '60px', fontSize: '1.25rem' }}>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateProfileCoach;
