import React, { createContext, useContext, useState } from "react";

// Crea el contexto
const ThemeContext = createContext();

// Crea un proveedor de tema
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark");

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.className = newTheme; // Cambia la clase del body
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook para usar el contexto de tema
export const useTheme = () => useContext(ThemeContext);
