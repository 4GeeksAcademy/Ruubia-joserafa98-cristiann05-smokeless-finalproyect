// src/pages/MapPage.js
import React, { useEffect } from 'react';
import Map from '../components/Map'; // Asegúrate de que la ruta sea correcta
import { useStore } from '../store/flux'; // Asegúrate de importar el contexto

const MapPage = () => {
  const { store, actions } = useStore();

  useEffect(() => {
    // Obtener las ubicaciones de los coaches al montar el componente
    actions.getCoachesLocations();
  }, [actions]);

  return (
    <div>
      <h1>Mapa de Coaches</h1>
      <Map coaches={store.coaches} /> 
    </div>
  );
};

export default MapPage;
