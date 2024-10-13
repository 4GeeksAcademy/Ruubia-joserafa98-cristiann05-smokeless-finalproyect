import React from 'react';

// Componente del Dashboard
const DashboardCard = ({ title, children }) => {
    return (
        <div style={styles.cardContainer}>
            <h2 style={styles.cardTitle}>{title}</h2>
            <div style={styles.cardContent}>
                {children}
            </div>
        </div>
    );
};

// Estilos en JS para el componente
const styles = {
    cardContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo blanco semi-transparente
        borderRadius: '20px', // Bordes redondeados
        padding: '20px', // Espaciado interno
        margin: '20px', // Espacio entre tarjetas
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Sombra suave
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Transiciones suaves
    },
    cardTitle: {
        color: '#ffffff', // Color del título
        fontSize: '24px', // Tamaño del título
        margin: 0, // Sin margen
        textAlign: 'center', // Centrado
    },
    cardContent: {
        marginTop: '10px', // Espacio entre el título y el contenido
        color: '#cbd5e1', // Color del texto del contenido
        textAlign: 'left', // Alinear el texto a la izquierda
    },
};

// Exportar el componente
export default DashboardCard;
