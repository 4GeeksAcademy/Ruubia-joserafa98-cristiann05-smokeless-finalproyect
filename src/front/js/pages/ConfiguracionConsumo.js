import React, { useState, useEffect } from "react";
import { useStore } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateProfileUser.css"; 
import logo from '../../img/logos/logoblanco.png';
import logoOscuro from '../../img/logos/logonegro.png';

const CreateConsumProfile = () => {
    const { store, actions } = useStore();
    const [formaConsumo, setFormaConsumo] = useState("cigarros");
    const [numeroCigarrillos, setNumeroCigarrillos] = useState(""); 
    const [periodicidadConsumo, setPeriodicidadConsumo] = useState("diaria"); 
    const [tiempoFumando, setTiempoFumando] = useState(""); 
    const [unidadTiempo, setUnidadTiempo] = useState("días"); // Nueva unidad de tiempo
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    useEffect(() => {
        if (store.loggedInUser) {
            setFormaConsumo(store.loggedInUser.forma_consumo || "cigarros");
            setNumeroCigarrillos(store.loggedInUser.numero_cigarrillos || "");
            setPeriodicidadConsumo(store.loggedInUser.periodicidad_consumo || "diaria");
            setTiempoFumando(store.loggedInUser.tiempo_fumando || "");
            setUnidadTiempo(store.loggedInUser.unidad_tiempo || "días");
            localStorage.setItem('loggedInUser', JSON.stringify(store.loggedInUser));
        }
    }, [store.loggedInUser]);

    useEffect(() => {
        actions.getTiposConsumo(); 
    }, [actions]);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError("");

        if (!store.loggedInUser) {
            setError("No hay usuario logueado. Por favor, inicia sesión.");
            return;
        }

        const updatedData = {
            forma_consumo: formaConsumo,
            numero_cigarrillos: numeroCigarrillos !== "" ? parseInt(numeroCigarrillos) : null,
            periodicidad_consumo: periodicidadConsumo,
            tiempo_fumando: tiempoFumando,
            unidad_tiempo: unidadTiempo // Se envía la unidad de tiempo también
        };

        const success = await actions.updateConsumptionProfile(store.loggedInUser.id, updatedData);
        if (success) {
            alert("Información de consumo actualizada con éxito");
            const updatedUser = { ...store.loggedInUser, ...updatedData };
            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
            navigate('/Dashboard-Smoker');
        } else {
            alert("Error al actualizar la información de consumo");
        }
    };

    if (!store.loggedInUser) {
        return <div>No hay usuario logueado. Por favor, inicia sesión.</div>;
    }

    const tiposConsumo = store.tiposConsumo || []; 

    return (
        <>
            <div className="row g-0 justify-content-center gradient-bottom-right start-purple middle-indigo end-pink">
                <div className="col-md-6 col-lg-5 col-xl-5 position-fixed start-0 top-0 vh-100 overflow-y-hidden d-none d-lg-flex flex-lg-column">
                    <div className="p-12 py-xl-10 px-xl-20">
                        <div className="d-block">
                            <img src={logo} alt="Logo" className="logo" />
                        </div>
                        <div className="mt-1 text-center px-5">
                            <h1 className="ls-tight fw-bolder display-6 text-white mb-3">
                                ¡CUÉNTANOS TUS HÁBITOS DE CONSUMO!
                            </h1>
                            <p className="text-white text-opacity-75 pe-xl-24" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                                Queremos entender mejor tu relación con el tabaco. Comparte con nosotros cuánto y con qué frecuencia fumas.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-7 offset-lg-5 min-vh-100 overflow-y-auto d-flex flex-column justify-content-center position-relative bg-body rounded-top-start-lg-4 rounded shadow-soft-5">
                    <div className="w-md-50 mx-auto px-10 px-md-0 py-10">
                        <div className="mb-10">
                            <a className="d-inline-block d-lg-none mb-10" href="/pages/dashboard.html">
                                <img src={logoOscuro} alt="Logo Oscuro" className="logo" />
                            </a>
                            <h1 className="ls-tight fw-bolder h1">Tu perfil como consumidor</h1> 
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form className="form" onSubmit={handleSubmit} style={{ fontSize: '1.25rem' }}>
                            <div className="group mb-4">
                                <i className="fa-solid fa-filter icon"></i>
                                <select
                                    value={formaConsumo}
                                    onChange={(e) => setFormaConsumo(e.target.value)}
                                    className="input"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                >
                                    <option value="" disabled>Selecciona la forma de consumo</option>
                                    {tiposConsumo.map(tipo => (
                                        <option key={tipo.id} value={tipo.name}>{tipo.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="group mb-4">
                                <i className="fa-solid fa-smoking icon"></i>
                                <input
                                    type="number"
                                    name="numeroCigarrillos"
                                    className="input"
                                    value={numeroCigarrillos}
                                    onChange={(e) => setNumeroCigarrillos(e.target.value)}
                                    placeholder="Número de cigarrillos por día"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>
                            <div className="group mb-4">
                                <i className="fa-solid fa-calendar icon"></i>
                                <select
                                    value={periodicidadConsumo}
                                    onChange={(e) => setPeriodicidadConsumo(e.target.value)}
                                    className="input"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                >
                                    <option value="" disabled>Selecciona la periodicidad</option>
                                    <option value="diaria">Diaria</option>
                                    <option value="semanal">Semanal</option>
                                    <option value="mensual">Mensual</option>
                                    <option value="anual">Anual</option>
                                </select>
                            </div>
                            <div className="group mb-4">
                                <i className="fa-solid fa-clock icon"></i>
                                <input
                                    type="number"
                                    name="tiempoFumando"
                                    className="input"
                                    value={tiempoFumando}
                                    onChange={(e) => setTiempoFumando(e.target.value)}
                                    placeholder="Tiempo fumando"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                />
                            </div>
                            <div className="group mb-4">
                                <i className="fa-solid fa-calendar icon"></i>
                                <select
                                    value={unidadTiempo}
                                    onChange={(e) => setUnidadTiempo(e.target.value)}
                                    className="input"
                                    required
                                    style={{ height: '60px', fontSize: '1.25rem' }}
                                >
                                    <option value="" disabled>Selecciona la unidad de tiempo</option>
                                    <option value="días">Días</option>
                                    <option value="semanas">Semanas</option>
                                    <option value="meses">Meses</option>
                                    <option value="años">Años</option>
                                </select>
                            </div>
                            <button className="btn btn-dark w-100" type="submit" style={{ fontSize: '1.25rem', padding: '15px' }}>
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateConsumProfile;