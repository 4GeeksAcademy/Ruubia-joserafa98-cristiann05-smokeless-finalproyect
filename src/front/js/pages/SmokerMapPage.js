import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Importar el CSS de Leaflet
import icnononavegacion from '../../img/logos/imagenesweb/localizacion.png'; // Asegúrate de que esta ruta es correcta

// Icono personalizado para el marcador
const customIcon = L.icon({
    iconUrl: icnononavegacion, // Usa la variable de importación directamente
    iconSize: [25, 41], // Tamaño del icono
    iconAnchor: [15, 41], // Punto de anclaje del icono
    popupAnchor: [1, -34], // Punto donde se abre el popup en relación al icono
});

const SmokerMapPage = () => {
    const [map, setMap] = useState(null); // Estado para almacenar la referencia del mapa
    const [marker, setMarker] = useState(null); // Estado para el marcador
    const [inputValue, setInputValue] = useState(''); // Estado para el input
    const [searchResults, setSearchResults] = useState([]); // Estado para almacenar resultados de búsqueda

    // Inicializar el mapa
    useEffect(() => {
        const initialMap = L.map('map').setView([51.505, -0.09], 13); // Establecer vista inicial
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(initialMap);

        setMap(initialMap); // Guardar la referencia del mapa

        return () => {
            initialMap.remove(); // Limpia el mapa al desmontar
        };
    }, []);

    // Manejar la búsqueda en tiempo real
    const handleSearch = (event) => {
        const value = event.target.value;
        setInputValue(value); // Actualizar el valor del input

        if (!value) {
            setSearchResults([]); // Limpiar resultados si el input está vacío
            return;
        }

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data); // Guardar resultados de búsqueda en el estado
                if (data.length > 0) {
                    const { lat, lon } = data[0]; // Obtener latitud y longitud

                    // Agregar o mover el marcador
                    if (marker) {
                        marker.setLatLng([lat, lon]);
                    } else {
                        const newMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map); // Usar el icono personalizado
                        setMarker(newMarker);
                    }
                } 
            })
            .catch(err => {
                console.error('Error al buscar la ubicación:', err);
                alert('Hubo un error al buscar la ubicación.');
            });
    };

    // Manejar el botón de búsqueda
    const handleButtonSearch = () => {
        if (inputValue) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const { lat, lon } = data[0]; // Obtener latitud y longitud

                        // Centrar el mapa en la ubicación seleccionada
                        map.setView([lat, lon], 13);

                        // Agregar o mover el marcador
                        if (marker) {
                            marker.setLatLng([lat, lon]);
                        } else {
                            const newMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map); // Usar el icono personalizado
                            setMarker(newMarker);
                        }

                        // Limpiar resultados
                        setSearchResults([]); // Limpiar resultados después de buscar
                    } else {
                        alert('No se encontraron resultados.');
                    }
                })
                .catch(err => {
                    console.error('Error al buscar la ubicación:', err);
                    alert('Hubo un error al buscar la ubicación.');
                });
        }
    };

    // Manejar la selección de resultados
    const handleSelectResult = (result) => {
        const { lat, lon } = result;

        // Centrar el mapa en la ubicación seleccionada
        map.setView([lat, lon], 13);

        // Agregar o mover el marcador
        if (marker) {
            marker.setLatLng([lat, lon]);
        } else {
            const newMarker = L.marker([lat, lon], { icon: customIcon }).addTo(map); // Usar el icono personalizado
            setMarker(newMarker);
        }

        setSearchResults([]); // Limpiar resultados después de seleccionar
        setInputValue(''); // Limpiar el input
    };

    return (
        <div style={{ paddingTop: '60px' }}> {/* Ajuste para evitar que el navbar cubra el contenido */}
            <h1>Buscar Ubicación en el Mapa</h1>
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
                <input
                    type="text"
                    placeholder="Ingresa una ciudad o dirección"
                    value={inputValue}
                    onChange={handleSearch} // Actualizar la búsqueda mientras se escribe
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '300px',
                        marginRight: '10px',
                    }}
                />
                <button onClick={handleButtonSearch} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', border: 'none' }}>
                    Buscar
                </button>
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
            <div id="map" style={{ height: '50vh', width: '100%' }}></div> {/* Mapa más corto, ocupa el 50% de la altura de la vista */}
        </div>
    );
};

export default SmokerMapPage;
