import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; // Importar el CSS específico
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const CreateProfileUser = () => {
    const { store, actions } = useStore(); // Acceso al store y acciones
    const [nombre_usuario, setnombre_usuario] = useState("");
    const [genero, setGenero] = useState("masculino");
    const [cumpleaños, setCumpleaños] = useState("");
    const [foto_usuario, setfoto_usuario] = useState(null); // Estado para la imagen
    const [error, setError] = useState(""); // Manejo de errores
    const navigate = useNavigate(); // Hook de navegación

    // Efecto para cargar los datos del usuario logueado
    useEffect(() => {
        if (store.loggedInUser) {
            setnombre_usuario(store.loggedInUser.nombre_usuario || ""); // Cargar nombre
            setGenero(store.loggedInUser.genero_usuario || "masculino"); // Cargar género
            if (store.loggedInUser.nacimiento_usuario && typeof store.loggedInUser.nacimiento_usuario === 'string') {
                setCumpleaños(store.loggedInUser.nacimiento_usuario.split("T")[0]); // Cargar cumpleaños
            }
            setfoto_usuario(store.loggedInUser.foto_usuario || null); // Cargar la imagen si existe
        }
    }, [store.loggedInUser]); // Efecto depende de los cambios en loggedInUser

    // Manejar la selección de la imagen
    const handleImageUpload = (e) => {
        setfoto_usuario(e.target.files[0]); // Guardar la imagen seleccionada
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        // Validación de que el usuario esté logueado
        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        // Subir la imagen a Cloudinary si se seleccionó una
        let imageUrl = store.loggedInUser.foto_usuario; // Si ya tiene una imagen, se conserva
        if (foto_usuario) {
            const uploadResult = await actions.uploadSmokerImage(foto_usuario); // Subir imagen
            console.log(uploadResult); // Imprime el resultado de Cloudinary para verificar los campos

            if (uploadResult && uploadResult.secure_url) {
                imageUrl = uploadResult.secure_url; // Usar la URL de la imagen subida
            } else {
                setError("Error al subir la imagen. Inténtalo de nuevo.");
                return;
            }
        }

        // Datos a enviar al actualizar perfil
        const updatedData = {
            nombre_usuario: nombre_usuario,
            genero_usuario: genero,
            nacimiento_usuario: cumpleaños,
            foto_usuario: imageUrl, // Guardar la URL de la imagen en la base de datos
        };

        console.log("Datos enviados en el perfil:", updatedData);

        // Llamada a la acción para actualizar el perfil
        const success = await actions.updateProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Perfil actualizado con éxito");
            navigate('/question-config-smoker'); // Navegar a la siguiente pantalla
        } else {
            alert("Error al actualizar el perfil");
        }
    };

    // Si no hay usuario logueado, muestra un mensaje
    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    return (
            <>
                <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
                    <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
                        <div className="p-12 py-xl-10 px-xl-20">
                            {/* Aquí puedes colocar tu logo */}
                            <div className="d-block">
                                <img src={logo} alt="Logo" className="logo" />
                            </div>
        
                            {/* Ajustes en el título y subtítulo */}
                            <div className="mt-16 text-center px-5">
                                <h1 className="ls-tight fw-bolder display-4 text-white mb-3">
                                    ¡Cuentanos más de ti!
                                </h1>
                                <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                                Ayudanos a conocerte mejor. Estos detalles básicos harán que tu experiencia sea única y personalizada en cada paso del camino.
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
                            
                            {/* Formulario para actualizar el perfil */}
                            <form className="form" onSubmit={handleSubmit} style={{ fontSize: '1.25rem' }}> 
                                
                                {/* Input de Nombre de Usuario */}
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
        
                                {/* Selección de Género */}
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
        
                                {/* Input de Fecha de Nacimiento */}
                                <div className="group mb-4">
                                    <i className="fa-regular fa-calendar icon"></i>
                                    <input
                                        type="date"
                                        name="cumpleaños"
                                        id="cumpleaños"
                                        className="input"
                                        value={cumpleaños}
                                        onChange={(e) => setCumpleaños(e.target.value)}
                                        required
                                        style={{ height: '60px', fontSize: '1.25rem' }}
                                    />
                                </div>
        
                                {/* Input para Subir Foto */}
                                <div className="group mb-4">
                                    <i className="fa-solid fa-camera icon"></i>
                                    <input
                                        type="file"
                                        name="foto"
                                        id="foto"
                                        className="input"
                                        onChange={handleImageUpload}
                                        style={{ height: '60px', fontSize: '1.25rem' }}
                                    />
                                </div>
        
                                {/* Botón de enviar */}
                                <button className="btn btn-dark w-100" type="submit" style={{ fontSize: '1.25rem', padding: '15px' }}>
                                    Actualizar Perfil
                                </button>
                            </form>
                        </div>
                    </div>
        
                </div>
            </>
        );
    }        

export default CreateProfileUser;