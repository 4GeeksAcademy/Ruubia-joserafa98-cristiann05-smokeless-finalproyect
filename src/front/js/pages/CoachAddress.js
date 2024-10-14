import React, { useState, useEffect } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/logins.css';
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const CoachAddress = () => {
    const { store, actions } = useStore();
    const [address, setAddress] = useState(''); // Estado para la dirección
    const [lat, setLat] = useState(null); // Estado para la latitud
    const [lon, setLon] = useState(null); // Estado para la longitud
    const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda
    const [debounceTimeout, setDebounceTimeout] = useState(null); // Para manejar el timeout
    const navigate = useNavigate();
    const [error, setError] = useState("");
    // Manejar la búsqueda en tiempo real con validación y debouncing
    const handleSearch = (event) => {
        const value = event.target.value;
        setAddress(value);

        if (value.length < 3) { // Esperar al menos 3 caracteres para buscar
            setSearchResults([]);
            return;
        }

        // Limpiar el timeout anterior
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Establecer un nuevo timeout
        const timeout = setTimeout(() => {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && Array.isArray(data)) {
                        setSearchResults(data);
                    } else {
                        console.warn('No se encontraron resultados para la búsqueda');
                        setSearchResults([]);
                    }
                })
                .catch(err => {
                    console.error('Error al buscar la ubicación:', err);
                    // No mostramos alerta aquí para no molestar al usuario
                });
        }, 300); // Espera 300ms antes de hacer la búsqueda

        // Guardar el timeout para limpiar después
        setDebounceTimeout(timeout);
    };

    const handleSelectResult = (result) => {
        const { lat, lon } = result;

        setAddress(result.display_name);
        setLat(lat);
        setLon(lon);
        setSearchResults([]);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();

        if (lat && lon) {
            const coachId = store.loggedInCoach.id;
            const coachData = {
                direccion: address,
                latitud: lat,
                longitud: lon,
            };

            const updated = await actions.updateProfileCoach(coachId, coachData);

            if (updated) {
                navigate("/Dashboard-coach");
            } else {
                alert("Hubo un problema al actualizar la ubicación del coach.");
            }
        } else {
            alert("Por favor, selecciona una ubicación válida.");
        }
    };

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
                            <h1 className="ls-tight fw-bolder h1">Ingresa tu Dirección</h1> 
                        </div>
    
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        {/* Formulario de Dirección */}
                        <form onSubmit={handleAddressSubmit} className="form" style={{ fontSize: '1.25rem' }}>
                            {/* Input de Dirección */}
                            <div className="group mb-4">
                                <i className="fa-solid fa-map-marker-alt icon"></i>
                                <input
                                    type="text"
                                    name="direccion"
                                    id="address"
                                    className="input"
                                    placeholder="Escribe una ciudad o dirección"
                                    value={address}
                                    onChange={handleSearch}
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>
    
                            {/* Resultados de Búsqueda */}
                            {searchResults.length > 0 && (
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: '20px' }}>
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectResult(result)}
                                            style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                                        >
                                            {result.display_name}
                                        </div>
                                    ))}
                                </div>
                            )}
    
                            {/* Botón de Continuar */}
                            <button className="btn btn-dark w-100" type="submit" style={{ fontSize: '1.25rem', padding: '15px' }}>
                                Continuar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );    
};

export default CoachAddress;