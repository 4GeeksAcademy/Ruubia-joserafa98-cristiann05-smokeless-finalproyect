// src/components/Map.js
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const Map = () => {
  const [coaches, setCoaches] = useState([]);
  const [map, setMap] = useState(null);

  // Obtener la lista de coaches desde el backend
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetch('https://friendly-computing-machine-4qwj557gg5jf74w5-3001.app.github.dev/api/coaches');
        if (!response.ok) {
          throw new Error('Error al obtener coaches: ' + response.statusText);
        }
        const data = await response.json();
        setCoaches(data);
      } catch (error) {
        console.error('Error al obtener coaches:', error);
      }
    };

    fetchCoaches();
  }, []);

  // Inicializar el mapa
  useEffect(() => {
    const initialMap = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(initialMap);
    
    // Agregar el control de geocodificación
    const geocoder = L.Control.geocoder().addTo(initialMap);
    geocoder.on('markgeocode', function(e) {
      const latlng = e.geocode.center;
      L.marker(latlng).addTo(initialMap).bindPopup(e.geocode.name).openPopup();
      initialMap.setView(latlng, 13);
    });

    setMap(initialMap); // Guardar la referencia del mapa

    return () => {
      initialMap.remove(); // Limpia el mapa cuando el componente se desmonta
    };
  }, []);

  // Agregar los marcadores para cada coach
  useEffect(() => {
    if (map) {
      // Limpiar los marcadores existentes antes de agregar nuevos
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      coaches.forEach(coach => {
        if (coach.latitud && coach.longitud) {
          L.marker([coach.latitud, coach.longitud]).addTo(map)
            .bindPopup(`<b>${coach.nombre_coach}</b><br>${coach.direccion}`);
        }
      });
    }
  }, [coaches, map]);

  return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default Map;
