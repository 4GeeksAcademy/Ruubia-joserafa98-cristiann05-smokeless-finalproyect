import React from "react";
import { Link } from "react-router-dom";
import Atropos from 'atropos/react'; // Importa Atropos
import 'atropos/css'; // Importa los estilos de Atropos
import foto from '../../img/logos/imagenesweb/prueba.png';
import Navbar from "../component/navbar";
import '../../styles/homePage.css';

export const Home = () => {

    return (
        <>
            <div className={`pt-5 pb-4 pt-lg-56 pb-lg-0 mt-n40 position-relative gradient-bottom-right start-indigo middle-purple end-yellow`}>
                <Navbar />
                <div className="container">
                    <div className="row align-items-center g-10">
                        <div className="col-lg-8 col-md-12 mt-5">
                            <h1 className="ls-tight fw-bolder display-4 text-white mb-4 mt-4 text-wrap" style={{ fontSize: '6rem' }}> {/* Ajusta el tamaño aquí */}
                                Deja de fumar para siempre...
                            </h1>
                            <p className="w-xl-75 lead text-white text-wrap">
                                Nuestros coaches especializados utilizan técnicas personalizadas y herramientas probadas para ayudarte a dejar de fumar de forma efectiva y definitiva. Sin importar tu nivel de consumo, estamos aquí para guiarte en cada paso del camino hacia una vida sin cigarrillos.
                            </p>
                        </div>
                        <div className="col-lg-6 col-md-12 align-self-end">
                            <div className="hstack gap-3 justify-content-lg-end mt-4">
                                <Link to="/signup-smoker">
                                    <button className={`register-button btn btn-light`}>
                                        REGISTRARSE COMO FUMADOR
                                    </button>
                                </Link>
                                <Link to="/signup-coach">
                                    <button className={`register-button btn btn-light`}>
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
                        <Atropos className="my-atropos" activeOffset={40} shadowScale={1.05}>
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
                            <h5 className="h5 mb-3 text-uppercase text-light">TODO DEPENDE DE TI...</h5>
                            <h1 className="display-4 font-display text-white fw-bolder lh-tight mb-4" style={{ fontSize: '5rem' }}>¡Comienza tu camino hoy!</h1>
                            <p className="text-lg text-light text-opacity-75">
                                Dejar de fumar es un viaje transformador que no solo mejora tu salud, sino que también revitaliza tu vida. Imagina disfrutar de una vida llena de energía, libre de humos y con la claridad mental que mereces. En Smokeless, te acompañamos en este camino hacia el bienestar, brindándote el apoyo y las herramientas necesarias para alcanzar tus metas y disfrutar de un futuro más saludable y pleno.
                            </p>
                        </div>
                    </div>

                    <div className="row g-6 g-lg-20" style={{ marginTop: '-170px', marginBottom: '20px' }}>
                        <div className="col-md-4">
                            <div className="card shadow-none border-0">
                                <div className="card-body p-7">
                                    <div className="mt-4 mb-7 mx-3">
                                        <div className="icon icon-shape text-white bg-primary rounded-circle text-lg" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-ban-smoking fa-2x"></i>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-3">
                                        <h5 className="h3 font-display fw-bold text-dark mb-3">Toma la decisión.</h5>
                                        <p className="text-dark">El primer paso hacia una vida sin humo comienza con una decisión valiente: ¡dejar de fumar! Reconocer la necesidad de un cambio es fundamental para transformar tu vida. Al registrarte en nuestra plataforma, no solo te comprometes contigo mismo, sino que también te abres a un mundo de posibilidades.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-none border-0">
                                <div className="card-body p-7">
                                    <div className="mt-4 mb-7 mx-3">
                                        <div className="icon icon-shape text-white bg-primary rounded-circle text-lg" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-handshake fa-2x"></i>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-3">
                                        <h5 className="h3 font-display fw-bold text-dark  mb-3">Conecta con los mejores profesionales</h5>
                                        <p className="text-dark">Te ofrecemos la oportunidad de conectar con coaches especializados que comprenden tus desafíos y están dedicados a guiarte en tu camino para liberarte del tabaco. Estos profesionales cuentan con una variedad de técnicas adaptadas a tus necesidades, asegurando un apoyo personalizado y efectivo.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-none border-0">
                                <div className="card-body p-7">
                                    <div className="mt-4 mb-7 mx-3">
                                        <div className="icon icon-shape text-white bg-primary rounded-circle text-lg" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="fa-solid fa-face-laugh-wink fa-2x"></i>
                                        </div>
                                    </div>
                                    <div className="pt-2 pb-3">
                                        <h5 className="h3 font-display  text-dark fw-bold mb-3">Disfruta de una Vida Sin Humos</h5>
                                        <p className="text-dark">Únete a nuestra comunidad y comienza a disfrutar de beneficios inmediatos! Desde más energía hasta una mejor calidad de vida, cada día sin fumar es un paso hacia un futuro más brillante. ¡Regístrate y empieza tu transformación hoy!</p>
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
                        <div className="col-md-6 text-center">
                            <h2 className="display-1 font-display text-primary fw-bold">23k+</h2>
                            <h1 className="font-display lh-tight text-dark fw-bolder display-5 mb-3">
                                Coaches y fumadores <span className="text-primary">ya confían en Smokeless...</span>
                            </h1>
                            <p className="lead mb-5">Únete a una comunidad de expertos dispuestos a ayudar a los demás...</p>
                        </div>
                    </div>

                    <div className="section-step-lg">
                        <div className="row justify-content-between align-items-center">
                            {/* Columna izquierda: Título, Subtítulo y Lista */}
                            <div className="col-lg-5 mb-7 mb-lg-0">
                                <h5 className="h5 mb-3 text-uppercase fw-bolder text-primary">SI ERES UN COACH...</h5>
                                <h1 className="ls-tight font-display text-dark fw-bolder mb-3">¡CONECTA Y TRANSFORMA!</h1>
                                <p className="lead mb-5">Convierte tu pasión por ayudar a otros en una carrera exitosa. Únete a nuestra plataforma y aprovecha la oportunidad de conectar con fumadores que buscan cambiar sus vidas. Desarrolla tus habilidades como coach mientras haces una diferencia real en la vida de quienes te rodean. ¡Inscríbete hoy y empieza a transformar vidas, incluyendo la tuya!</p>

                                <ul className="list-unstyled mt-6 mb-2">
                                    <li className="py-2 list-item mb-3">
                                        <div className="d-flex align-items-center">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa-solid fa-circle-check fa-2x mx-4"></i>
                                            </div>
                                            <div>
                                                <p className="fw-semibold">Conecta con Fumadores en Tu Área: Expande tu red y ayuda a quienes más lo necesitan.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="py-2 list-item mb-3">
                                        <div className="d-flex align-items-center">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa-solid fa-circle-check fa-2x mx-4"></i>
                                            </div>
                                            <div>
                                                <p className="fw-semibold">Herramientas Avanzadas para el Éxito: Aprovecha recursos innovadores para guiar a tus clientes en su camino hacia una vida sin humo.</p>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="py-2 list-item mb-3">
                                        <div className="d-flex align-items-center">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <i className="fa-solid fa-circle-check fa-2x mx-4"></i>
                                            </div>
                                            <div>
                                                <p className="fw-semibold">Chatea y Ofrece Soporte Personalizado: Brinda consejos y motivación a través de chats directos, adaptando tu enfoque a cada fumador.</p>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-6">
                                <img src="https://media.istockphoto.com/id/1728008421/es/foto/profesor-mentor-estudiante-universitario.jpg?s=1024x1024&w=is&k=20&c=HcpELb7Ql-NTrM2oDfy5I-5xITivpldfqWoB06kxgfU=" className="img-fluid rounded highlight-image" alt="Imagen de prueba" />
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
                                    <img src="https://media.istockphoto.com/id/1783743772/es/foto/oradora-femenina-dando-una-presentaci%C3%B3n-durante-un-seminario-de-negocios-en-el-centro-de.jpg?s=1024x1024&w=is&k=20&c=BCXkREMj6sFVgEeEKF7lff-ikLE_drUxvRb6dggRuME=" className="img-fluid rounded highlight-image" alt="Imagen de prueba" />
                                </div>

                                <div className="col-lg-5 mb-7 mb-lg-0">
                                    <h5 className="h5 mb-3 text-uppercase fw-bolder text-primary">Impulsa el cambio hacia un futuro sin humo...</h5>
                                    <h1 className="ls-tight font-display text-dark fw-bolder mb-3">AYUDA A LAS PERSONAS A ALCANZAR SUS METAS Y DEJAR DE FUMAR DE MANERA EFECTIVA.</h1>
                                    <p className="lead">Conviértete en el coach que tus clientes necesitan </p>

                                    <ul className="list-unstyled mt-6 mb-5">
                                        <li className="py-2 list-item mb-3">
                                            <div className="d-flex align-items-center">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fa-solid fa-circle-check fa-2x mx-4"></i>
                                                </div>
                                                <div>
                                                    <p className="fw-semibold">Crea un entorno positivo donde los fumadores puedan compartir sus experiencias.</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2 list-item mb-3">
                                            <div className="d-flex align-items-center">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fa-solid fa-circle-check fa-2x mx-4"></i>
                                                </div>
                                                <div>
                                                    <p className="fw-semibold"> Mantén el compromiso con tus clientes a través de sesiones de seguimiento.</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="py-2 list-item mb-3">
                                            <div className="d-flex align-items-center">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <i className="fa-solid fa-circle-check fa-2x mx-4"></i>
                                                </div>
                                                <div>
                                                    <p className="fw-semibold">Utiliza Nuestras herramientas interactivas.</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>

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
                                    <button className="btn btn-primary" onClick={() => window.location.href = '/signup-smoker'}>
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
                                © Copyright 2023 FullStackers - Joserafa98, cristiann05 & Ruubia.
                            </p>
                        </div>
                    </div>

                </div>
            </footer>

        </>
    );
};
