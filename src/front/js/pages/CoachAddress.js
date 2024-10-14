import React, { useState, useEffect } from 'react';
import { useStore } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/logins.css';
import Navbar from '../component/navbar';

const CoachAddress = () => {
    const { store, actions } = useStore();
    const [address, setAddress] = useState(''); // Estado para la dirección
    const [lat, setLat] = useState(null); // Estado para la latitud
    const [lon, setLon] = useState(null); // Estado para la longitud
    const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda
    const [debounceTimeout, setDebounceTimeout] = useState(null); // Para manejar el timeout
    const navigate = useNavigate();

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
        <div>
            <Navbar />
            <div className="form-container">
                <p className="title">Ingresa tu Dirección</p>
                <form onSubmit={handleAddressSubmit} className="form">
                    <div className="input-group">
                        <label htmlFor="address">Dirección</label>
                        <input 
                            type="text" 
                            id="address" 
                            placeholder="Escribe una ciudad o dirección" 
                            value={address} 
                            onChange={handleSearch} // Mantiene la búsqueda en tiempo real
                            required 
                        />
                    </div>
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
                    <button type="submit" className="sign">Continuar</button>
                </form>
            </div>
        </div>
    );
};

export default CoachAddress;