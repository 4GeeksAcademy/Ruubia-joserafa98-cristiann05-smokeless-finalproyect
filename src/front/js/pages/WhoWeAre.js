import React from "react";
import { Link } from "react-router-dom";
import Atropos from 'atropos/react'; // Importa Atropos
import 'atropos/css'; // Importa los estilos de Atropos
import foto from '../../img/logos/imagenesweb/prueba.png';
import Navbar from "../component/navbar";
import '../../styles/homePage.css';
import Cristian from "../../img/logos/imagenesweb/Cristian.jpg"
import Jose from "../../img/logos/imagenesweb/Jose.jpeg"
import Beatriz from "../../img/logos/imagenesweb/Beatriz.jpg"

export const WhoAreWe = () => {

    return (
        <>
            <div className={`pt-5 pb-4 pt-lg-56 pb-lg-0 mt-n40 position-relative gradient-bottom-right start-indigo middle-purple end-yellow`}>
                <Navbar />
                <div className="container">
                    <div className="row align-items-center g-10">
                        <div className="col-lg-8 col-md-12 mt-5">
                            <br></br>
                            <h1 className="ls-tight fw-bolder display-4 text-white mb-4 mt-4 text-wrap" style={{ marginTop: '10px',fontSize: '6rem' }}> {/* Ajusta el tamaño aquí */}
                                Conoce al equipo detrás de Smokeless...
                            </h1>
                            <p className="w-xl-75 lead text-white text-wrap mb-5">
                            Desarrolladores apasionados creando soluciones innovadoras para ayudarte a dejar de fumar.
                            </p>
                            <br />
                            <br />
                        </div>

                    </div>
                </div>
            </div>

            <div className="py-20 pt-lg-32 pb-lg-20">
                <div className="container mw-screen-xl">
                    <div className="row justify-content-center mb-10 mb-lg-24">
                        <div className="col-md-6 text-center">
                            <h2 className="display-1 font-display text-primary fw-bold">Los FullStackers...</h2>
                            <h1 className="font-display lh-tight text-dark fw-bolder display-5 mb-3">
                                ¡Un grupo de jovenes que llevan su talento al siguiente nivel! <span className="text-primary">Este es nuestro equipo:</span>
                            </h1>
                        </div>
                    </div>

                    <div className="section-step-lg">
                        <div className="row justify-content-between align-items-center">
                            {/* Columna izquierda: Título, Subtítulo y Lista */}
                            <div className="col-lg-5 mb-7 mb-lg-0">
                                <h5 className="h5 mb-3 text-uppercase fw-bolder text-primary">Cristian Ayala Sánchez</h5>
                                <h1 className="ls-tight font-display text-dark fw-bolder mb-3">Full Stack Developer</h1>
                                <p className="lead mb-5">Soy Cristian Ayala Sánchez, un Full Stack Developer apasionado por la tecnología y la creación de soluciones web. Me encanta enfrentar desafíos y aprender constantemente nuevas habilidades en el desarrollo de software. Siempre busco formas de mejorar mis conocimientos y de aplicar lo que aprendo en proyectos significativos.

                                En mi tiempo libre, disfruto explorar nuevas tendencias en tecnología y colaborar con otros desarrolladores. Mi objetivo es seguir creciendo en mi carrera y contribuir a proyectos que impacten positivamente en la sociedad.</p>

                                <div className="social-buttons d-flex mt-4">
                                        <a href="https://github.com/cristiann05" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-lg mx-2">
                                            <i className="fa-brands fa-github fa-2x"></i>
                                        </a>

                                        
                                        <a href="https://www.linkedin.com/in/cristian05/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-lg mx-2">
                                            <i className="fa-brands fa-linkedin fa-2x"></i>
                                        </a>

                                       
                                        <a href="https://www.instagram.com/cristian_as05" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger btn-lg mx-2">
                                            <i className="fa-brands fa-instagram fa-2x"></i>
                                        </a>
                                    </div>
                            </div>
                            <div className="col-lg-6">
                                <img src={Cristian} className="img-fluid rounded highlight-image" alt="Cristian Ayala Sánchez" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 pt-lg-32 pb-lg-20">
                <div className="container mw-screen-xl">
                    <div className="row justify-content-center mb-10 mb-lg-24">
                        <div className="section-step-lg">
                            <div className="row justify-content-between align-items-center">
                                <div className="col-lg-6">
                                    <img src={Jose} className="img-fluid rounded highlight-image" alt="Imagen de prueba" />
                                </div>

                                <div className="col-lg-5 mb-7 mb-lg-0">
                                    <h5 className="h5 mb-3 text-uppercase fw-bolder text-primary">José Hernández</h5>
                                    <h1 className="ls-tight font-display text-dark fw-bolder mb-3">Full Stack Developer </h1>
                                    <p className="lead">Soy José Hernández, periodista y marketer egresado de la Universidad Arturo Michelena, con una pasión por el aprendizaje continuo y una sólida trayectoria en el desarrollo web. Actualmente Full Stack Developer, especializado en la creación de soluciones tecnológicas con un enfoque integral, combinando habilidades en front-end y back-end. Busco seguir perfeccionándome en el área de Inteligencia Artificial para aplicar sus innovaciones en el mundo digital. </p>
                                    <div className="social-buttons d-flex mt-4">
                                        <a href="https://github.com/Joserafa98" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-lg mx-2">
                                            <i className="fa-brands fa-github fa-2x"></i>
                                        </a>

                                        {/* Botón de LinkedIn */}
                                        <a href="https://www.linkedin.com/in/jose-hernandez-67605813b/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-lg mx-2">
                                            <i className="fa-brands fa-linkedin fa-2x"></i>
                                        </a>

                                        {/* Botón de Instagram */}
                                        <a href="https://www.instagram.com/joserafa98" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger btn-lg mx-2">
                                            <i className="fa-brands fa-instagram fa-2x"></i>
                                        </a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-20 pt-lg-32 pb-lg-20">
                <div className="container mw-screen-xl">
                    <div className="row justify-content-center mb-10 mb-lg-24">
                    <div className="section-step-lg">
                        <div className="row justify-content-between align-items-center">
                            {/* Columna izquierda: Título, Subtítulo y Lista */}
                            <div className="col-lg-5 mb-7 mb-lg-0">
                                <h5 className="h5 mb-3 text-uppercase fw-bolder text-primary">Beatriz Carmona Jurado</h5>
                                <h1 className="ls-tight font-display text-dark fw-bolder mb-3">Full Stack Developer</h1>
                                <p className="lead mb-5">Soy Beatriz Carmona, una entusiasta de la tecnología y el desarrollo de software. Actualmente trabajo como Técnico de Operaciones en un Centro de Datos (DCO L4) en AWS, Dublín. Me encanta aprender y enfrentar nuevos desafíos cada día, lo que me ha llevado a inscribirme en un Bootcamp de Full Stack Software Developer en 4Geeks Academy.
                                Mis principales fortalezas son el trabajo en equipo, la resolución de problemas y mi capacidad autodidacta. Busco seguir creciendo como desarrolladora y contribuir a proyectos con impacto positivo.</p>
                                <div className="social-buttons d-flex mt-4">
                                        <a href="https://github.com/Ruubia" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-lg mx-2">
                                            <i className="fa-brands fa-github fa-2x"></i>
                                        </a>

                                        {/* Botón de LinkedIn */}
                                        <a href="https://www.linkedin.com/in/beatrizcarmonajurado" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-lg mx-2">
                                            <i className="fa-brands fa-linkedin fa-2x"></i>
                                        </a>

                                        {/* Botón de Instagram */}
                                        <a href="https://www.instagram.com/ruubi_a/" target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger btn-lg mx-2">
                                            <i className="fa-brands fa-instagram fa-2x"></i>
                                        </a>
                                    </div>
                               
                            </div>
                            <div className="col-lg-6">
                                <img src={Beatriz} className="img-fluid rounded highlight-image" alt="Cristian Ayala Sánchez" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            <div className="py-20 py-lg-20">
                <div className="container mw-screen-xl">
                    <div className="py-32 gradient-bottom-right start-gray middle-black end-gray rounded-5 px-lg-16 text-center text-md-start">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-10 col-lg-8 text-center">
                                <h1 className="ls-tight fw-bolder display-4 mb-5 text-white">¿Estás listo para comenzar?</h1>
                                <p className="lead text-white opacity-8 mb-10">¡Da el primer paso hacia tu futuro libre de humo y descubre un mundo de oportunidades! Regístrate ahora y comienza tu transformación.</p>
                                <div className="mx-n2">
                                    <button className="btn btn-light" onClick={() => window.location.href = '/signup-smoker'}>
                                        Comienza tu travesía hoy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="pt-24 pb-10">
                <div className="container mw-screen-xl">
                    <div className="row">
                        <div className="col">
                            <div className="pe-6 ml-5" style={{ textAlign: 'center' }}>

                                <h3 className="h2 text-heading fw-semibold lh-lg mb-0" style={{ fontSize: '1rem' }}>
                                    Este proyecto fue creado por
                                </h3>
                                <h2 className="h2 text-heading fw-semibold lh-lg mb-3" style={{ fontSize: '2rem' }}>
                                    Los FullStackers
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Redes sociales centradas */}
                    <div className="row mt-2 mb-7 justify-content-center">
                        <div className="col-auto">
                            <ul className="nav mx-n4">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link text-lg text-muted text-primary-hover">
                                        <i className="fa-brands fa-github fa-2x"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link text-lg text-muted text-primary-hover">
                                        <i className="fa-brands fa-instagram fa-2x"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link text-lg text-muted text-primary-hover">
                                        <i className="fa-brands fa-facebook fa-2x"></i>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link text-lg text-muted text-primary-hover">
                                        <i className="fa-brands fa-linkedin fa-2x"></i>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Texto de copyright centrado */}
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <p className="text-sm text-muted text-center">
                                © Copyright 2024 FullStackers - Joserafa98, cristiann05 & Ruubia.
                            </p>
                        </div>
                    </div>

                </div>
            </footer>

        </>
    );
};