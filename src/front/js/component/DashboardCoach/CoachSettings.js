import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams } from "react-router-dom"; 
import { Context } from "../../store/appContext";
import Sidebar from "./SiderbarCoach"; 
import Header from "./HeaderCoach"; 

const CoachSettings = () => {
    const { coachId } = useParams();
    const { store, actions } = useContext(Context);
    const [coachData, setCoachData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [active, setActive] = useState("home");
    // Estados para la dirección
    const [address, setAddress] = useState('');
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    useEffect(() => {
        const fetchCoachProfile = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                setCoachData(data);
                setFormData(data);
                setAddress(data.direccion || ''); // Inicializa la dirección
            } catch (error) {
                console.error("Error al obtener el perfil del coach:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCoachProfile();
    }, [coachId]);

    const handleNavigation = (item) => {
        if (!item || !item.name || !item.path) {
          console.error("Error: item is undefined or missing name/path", item);
          return; // Evita ejecutar la navegación si item no está definido correctamente
        }
        setActive(item.name);
        navigate(item.path);
      };
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
      };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSaveChanges = useCallback(async () => {
        try {
            const updatedData = {
                ...formData,
                direccion: address, // Añade la dirección a los datos que se van a guardar
                latitud: lat,
                longitud: lon,
            };

            const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const updatedCoach = await response.json();
            setCoachData(updatedCoach);
            setFormData(updatedCoach);
            setIsEditingProfile(false);
        } catch (error) {
            console.error("Error al actualizar el perfil del coach:", error);
            setError(error.message);
        }
    }, [formData, coachId, address, lat, lon]);

    // Manejo de búsqueda de dirección
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

    if (loading) {
        return <p className="text-center text-gray-400">Cargando perfil del coach...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!coachData) {
        return <p className="text-center text-gray-400">No se pudo cargar el perfil del coach.</p>;
    }

    const { nombre_coach, genero_coach, fecha_nacimiento, foto_coach } = coachData;

    return (
        <div className={`flex min-h-screen ${isDarkMode ? 'bg-indigo-900 text-white' : 'bg-yellow-100 text-gray-900'}`}>
            <Sidebar 
                active={active} 
                isDarkMode={isDarkMode} 
                handleNavigation={handleNavigation} 
            />
            <div className="md:ml-64 flex-1">
                <Header
                    active={active}
                    isDarkMode={isDarkMode}
                    toggleTheme={toggleTheme}
                />
                <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`container mx-auto p-6 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
                        {/* Botón Volver Atrás */}
                        <button
                            onClick={() => window.history.back()}
                            className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-light text-dark' : 'bg-blue-700 text-white'} font-semibold rounded-lg shadow hover:${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} transition duration-200`}
                        >
                            Volver Atrás
                        </button>
    
                        <h2 className={`text-center text-3xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-6`}>Configuración del Coach</h2>
                        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-center mb-4">
                                    {foto_coach ? (
                                        <img src={foto_coach} alt="Foto del coach" className="w-28 h-28 rounded-full border-2 border-blue-500" />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                            <span className="text-gray-400">Sin foto</span>
                                        </div>
                                    )}
                                </div>
    
                                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-4`}>Perfil del Coach</h3>
                                <form>
                                    <div className="mb-4">
                                        <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nombre del Coach:</label>
                                        {isEditingProfile ? (
                                            <input
                                                type="text"
                                                name="nombre_coach"
                                                value={formData.nombre_coach || ''}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full p-2 border rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'} focus:outline-none focus:ring focus:ring-blue-200`}
                                            />
                                        ) : (
                                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{nombre_coach}</p>
                                        )}
                                    </div>
    
                                    <div className="mb-4">
                                        <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Género:</label>
                                        {isEditingProfile ? (
                                            <select
                                                name="genero_coach"
                                                value={formData.genero_coach || ''}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full p-2 border rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'} focus:outline-none focus:ring focus:ring-blue-200`}
                                            >
                                                <option value="">Selecciona</option>
                                                <option value="masculino">Masculino</option>
                                                <option value="femenino">Femenino</option>
                                            </select>
                                        ) : (
                                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{genero_coach}</p>
                                        )}
                                    </div>
    
                                    <div className="mb-4">
                                        <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fecha de Nacimiento:</label>
                                        {isEditingProfile ? (
                                            <input
                                                type="date"
                                                name="fecha_nacimiento"
                                                value={formData.fecha_nacimiento || ''}
                                                onChange={handleChange}
                                                className={`mt-1 block w-full p-2 border rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'} focus:outline-none focus:ring focus:ring-blue-200`}
                                            />
                                        ) : (
                                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{fecha_nacimiento}</p>
                                        )}
                                    </div>
    
                                    {/* Campo de Dirección */}
                                    <div className="mb-4">
                                        <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dirección:</label>
                                        {isEditingProfile ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={address}
                                                    onChange={handleSearch}
                                                    className={`mt-1 block w-full p-2 border rounded border-gray-300 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-black'} focus:outline-none focus:ring focus:ring-blue-200`}
                                                    placeholder="Buscar dirección..."
                                                />
                                                {searchResults.length > 0 && (
                                                    <ul className="bg-white border border-gray-300 mt-2 rounded">
                                                        {searchResults.map((result, index) => (
                                                            <li
                                                                key={index}
                                                                onClick={() => handleSelectResult(result)}
                                                                className="p-2 cursor-pointer hover:bg-blue-100"
                                                            >
                                                                {result.display_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ) : (
                                            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{address || 'No especificada'}</p>
                                        )}
                                    </div>
    
                                    {isEditingProfile ? (
                                        <button
                                            type="button"
                                            onClick={handleSaveChanges}
                                            className={`w-full ${isDarkMode ? 'bg-light text-dark' : 'bg-blue-700 text-white'} font-semibold py-2 rounded hover:${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} transition duration-200`}
                                        >
                                            Guardar Cambios
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(true)}
                                            className={`w-full ${isDarkMode ? 'bg-light text-dark' : 'bg-blue-700 text-white'} font-semibold py-2 rounded hover:${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'} transition duration-200`}
                                        >
                                            Editar
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}    

export default CoachSettings;
