import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Asegúrate de que este CSS esté importado
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const CreateProfileUser = () => {
    const { store, actions } = useStore();
    const [nombre_usuario, setnombre_usuario] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState(null);
    const [urlImagen, setUrlImagen] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (store.loggedInUser) {
            setnombre_usuario(store.loggedInUser.nombre_usuario || "");
            setGenero(store.loggedInUser.genero_usuario || "masculino");
            if (store.loggedInUser.nacimiento_usuario && typeof store.loggedInUser.nacimiento_usuario === 'string') {
                setCumpleaños(new Date(store.loggedInUser.nacimiento_usuario));
            }
            setUrlImagen(store.loggedInUser.public_id || "");
        }
    }, [store.loggedInUser]);

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
            console.log(result);
    
            if (response.ok) {
                setUrlImagen(result.secure_url);
                localStorage.setItem("profileImageUrl", result.secure_url); // Guardar en localStorage
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

        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        // Validar que el usuario sea mayor de edad
        if (!isAdult(cumpleaños)) {
            setError("Debes ser mayor de 18 años para registrarte.");
            return;
        }

        const updatedData = {
            nombre_usuario,
            genero_usuario: genero,
            nacimiento_usuario: cumpleaños.toISOString().split("T")[0],
            public_id: urlImagen,
        };

        console.log("Datos enviados en el perfil:", updatedData);

        const success = await actions.updateProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/question-config-smoker');
        } else {
            alert("Error al actualizar el perfil");
        }
    };

    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    return (
        <>
            <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
                <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
                    <div className="p-12 py-xl-10 px-xl-20">
                        <div className="d-block">
                            <img src={logo} alt="Logo" className="logo" />
                        </div>
        
                        <div className="mt-1 text-center px-5">
                            <h1 className="ls-tight fw-bolder display-6 text-white mb-3">
                                ¡Cuéntanos más de ti!
                            </h1>
                            <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                Ayúdanos a conocerte mejor. 
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
                            <div className="group mb-4">
                                <i className="fa-regular fa-user icon"></i>
                                <input
                                    type="text"
                                    name="nombre_usuario"
                                    id="nombre_usuario"
                                    className="input"
                                    value={nombre_usuario}
                                    onChange={(e) => setnombre_usuario(e.target.value)}
                                    placeholder="Nombre de Usuario"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>
        
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

                            <div className="group mb-4">
                                <i className="fa-solid fa-image icon"></i>
                                <input
                                    id="file-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={changeUploadImage}
                                    required
                                    className="input"
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>

                            {urlImagen && (
                                <div className="mb-4 text-center">
                                    <img src={urlImagen} alt="Imagen subida" width="200" className="img-preview" />
                                    <button 
                                        type="button" 
                                        onClick={handleDeleteImage} 
                                        className="btn btn-light mt-2"
                                        style={{ border: 'none', background: 'transparent' }}
                                    >
                                        <i className="fa-solid fa-trash" style={{ color: 'red' }}></i>
                                    </button>
                                </div>
                            )}

                            {/* Botón para guardar cambios con los estilos especificados */}
                            <button className="btn btn-dark w-100" type="submit" style={{ marginTop: '10px', fontSize: '1.25rem', padding: '15px' }}>
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateProfileUser;