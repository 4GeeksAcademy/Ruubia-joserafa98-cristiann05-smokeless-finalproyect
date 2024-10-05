import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/homePage.css"; // CSS global
import Atropos from 'atropos/react'; // Importa Atropos
import 'atropos/css'; // Importa los estilos de Atropos
import foto from '../../img/logos/imagenesweb/prueba.png';
import CustomButton from '../component/button'; // Importa tu botón personalizado

export const Home = ({ toggleTheme }) => {
    const [isLightTheme, setIsLightTheme] = useState(false);

    useEffect(() => {
        const text = "Bienvenido a Smokeless";
        const container = document.getElementById("animatedText");

        // Crear spans para cada letra
        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.className = "letter";
            span.innerHTML = char === " " ? "&nbsp;" : char;
            container.appendChild(span);
        });

        const letters = document.querySelectorAll(".letter");
        const totalLetters = letters.length;
        const delayIncrement = 100;

        function easeInOutQuart(t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        }

        function animateLetters(forward = true) {
            letters.forEach((letter, index) => {
                const normalizedIndex = Math.max(index, totalLetters - 1 - index) / (totalLetters - 1);
                const easedDelay = easeInOutQuart(normalizedIndex);
                const delay = easedDelay * (totalLetters - 1) * delayIncrement;

                setTimeout(() => {
                    letter.style.setProperty("--wght", forward ? 700 : 100);
                    letter.style.setProperty("--wdth", forward ? 400 : 150);
                    letter.style.setProperty("--opacity", forward ? 1 : 0.25);
                    letter.style.setProperty("--letter-spacing", forward ? '0.05em' : '0em');
                }, delay);
            });

            setTimeout(() => animateLetters(!forward), 4000);
        }

        animateLetters();
    }, []);

    const handleThemeToggle = () => {
        setIsLightTheme(prev => !prev); // Cambia entre los temas
        toggleTheme(); // Llama a la función proporcionada para alternar el tema global
    };

    return (
        <div className={`container ${isLightTheme ? 'light' : 'dark'}`}>
            <div className="animated-text" id="animatedText"></div>

            <div className="button-container" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '20px' }}>
                <Link to="/signup-smoker">
                    <button className="register-button">
                        REGISTRARSE COMO FUMADOR
                    </button>
                </Link>
                <Link to="/signup-coach">
                    <button className="register-button">
                        REGISTRARSE COMO COACH
                    </button>
                </Link>
            </div>
            <div className="mt-4">
                <Link to="/login-selection">
                    <CustomButton>Ya tengo una cuenta</CustomButton>
                </Link>
            </div>

            <div className="mt-5">
                <Atropos
                    className="my-atropos"
                    activeOffset={40}
                    shadowScale={1.05}
                >
                    <img className="atropos-image" src={foto} data-atropos-offset="0" alt="3D Effect" />
                </Atropos>
            </div>
        </div>
    );
};
