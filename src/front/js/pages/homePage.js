import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/homePage.css"; // CSS global
import Atropos from 'atropos/react'; // Importa Atropos
import 'atropos/css'; // Importa los estilos de Atropos
import foto from '../../img/logos/imagenesweb/prueba.png';
import Navbar from "../component/navbar";

export const Home = ({ toggleTheme }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light'; // Valor predeterminado 'light'
    });

    useEffect(() => {
        const text = "Deja de fumar para siempre.";
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

            setTimeout(() => animateLetters(!forward), 4000); // Ciclo para la animación
        }

        animateLetters(); // Iniciar animación
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'; // Alternar tema
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Guardar en localStorage
        toggleTheme(); // Llama a la función proporcionada para alternar el tema global
    };

    return (
        <>
            <Navbar toggleTheme={handleThemeToggle} theme={theme} className="mb-5" />
            <div className={`pt-5 pb-4 pt-lg-56 pb-lg-0 mt-n40 position-relative gradient-bottom-right start-indigo middle-purple end-yellow ${theme}`}>
                <div className="container">
                    <div className="row align-items-center g-10">
                        <div className="col-lg-8 col-md-12 mt-5">
                            <h1 className="ls-tight fw-bolder display-4 text-white mb-4 mt-4 text-wrap">
                                <div id="animatedText"></div> {/* Animación de letras */}
                            </h1>
                            <p className="w-xl-75 lead text-white text-wrap">
                                "Nuestros coaches especializados utilizan técnicas personalizadas y herramientas probadas para ayudarte a dejar de fumar de forma efectiva y definitiva. Sin importar tu nivel de consumo, estamos aquí para guiarte en cada paso del camino hacia una vida sin cigarrillos."
                            </p>
                        </div>
                        <div className="col-lg-6 col-md-12 align-self-end">
                            <div className="hstack gap-3 justify-content-lg-end mt-4">
                                <Link to="/signup-smoker">
                                    <button className={`register-button btn btn-light ${theme}`}>
                                        REGISTRARSE COMO FUMADOR
                                    </button>
                                </Link>
                                <Link to="/signup-coach">
                                    <button className={`register-button btn btn-light ${theme}`}>
                                        REGISTRARSE COMO COACH
                                    </button>
                                </Link>
                                <Link to="/login-selection">
                                    <button className="btn btn-outline-light">
                                        YA TENGO UNA CUENTA
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-center">
                        <Atropos
                            className="my-atropos"
                            activeOffset={40}
                            shadowScale={1.05}
                        >
                            <img className="atropos-image" src={foto} data-atropos-offset="0" alt="3D Effect" />
                        </Atropos>
                    </div>
                </div>
            </div>
           {/* Nuevo segmento "How it works" */}
           <div className="mt-2 py-20 pt-lg-32 bg-dark rounded-bottom-4 overflow-hidden position-relative z-1">
                <div className="container mw-screen-xl">
                    <div className="row">
                        <div className="col-lg-6 col-md-10">
                            <h5 className="h5 mb-5 text-uppercase text-primary">how it works</h5>
                            <h1 className="display-4 font-display text-white fw-bolder lh-tight mb-4">Comienza tu camino hoy</h1>
                            <p className="text-lg text-white text-opacity-75">Dejar de fumar es un viaje transformador que no solo mejora tu salud, sino que también revitaliza tu vida. Imagina disfrutar de una vida llena de energía, libre de humos y con la claridad mental que mereces. En Smokeless, te acompañamos en este camino hacia el bienestar, brindándote el apoyo y las herramientas necesarias para alcanzar tus metas y disfrutar de un futuro más saludable y pleno.</p>
                        </div>
                    </div>
                    <div className="row g-6 g-lg-20 my-10">
                        <div className="col-md-4">
                            <div className="card shadow-none border-0">
                                <div className="card-body p-7">
                                    <div className="mt-4 mb-7 mx-3">
                                        <div className="icon icon-shape text-white bg-primary rounded-circle text-lg" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-ban-smoking"></i>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-3">
                                        <h5 className="h3 font-display fw-bold mb-3">Toma la decisión.</h5>
                                        <p className="text-light">El primer paso hacia una vida sin humo comienza con una decisión valiente: ¡dejar de fumar! Reconocer la necesidad de un cambio es fundamental para transformar tu vida. Al registrarte en nuestra plataforma, no solo te comprometes contigo mismo, sino que también te abres a un mundo de posibilidades.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-none border-0">
                                <div className="card-body p-7">
                                    <div className="mt-4 mb-7 mx-3">
                                        <div className="icon icon-shape text-white bg-primary rounded-circle text-lg" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-lightbulb"></i>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-3">
                                        <h5 className="h3 font-display fw-bold mb-3">Conecta con los mejores profesionales</h5>
                                        <p className="text-light">te ofrecemos la oportunidad de conectar con coaches especializados que comprenden tus desafíos y están dedicados a guiarte en tu camino para liberarte del tabaco. Estos profesionales cuentan con una variedad de técnicas adaptadas a tus necesidades, asegurando un apoyo personalizado y efectivo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-none border-0">
                                <div className="card-body p-7">
                                    <div className="mt-4 mb-7 mx-3">
                                        <div className="icon icon-shape text-white bg-primary rounded-circle text-lg" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-chart-line"></i>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-3">
                                        <h5 className="h3 font-display fw-bold mb-3">Disfruta de una Vida Sin Humos</h5>
                                        <p className="text-light">Únete a nuestra comunidad y comienza a disfrutar de beneficios inmediatos! Desde más energía hasta una mejor calidad de vida, cada día sin fumar es un paso hacia un futuro más brillante. ¡Regístrate y empieza tu transformación hoy!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
