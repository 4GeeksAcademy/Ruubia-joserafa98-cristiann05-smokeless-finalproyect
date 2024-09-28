import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const TiposConsumo = ()=>{
    const { store, actions } = useContext(Context);
    const { tiposconsumo } = store;
    const [consumingValue, setConsumingValue] = useState("");

    useEffect(() => {
        actions.getConsuming();
    }, []);

    const handleInputChange = (e) => {
        setConsumingValue(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (consumingValue.trim()) {
            actions.createConsuming({ name: consumingValue }); 
            setConsumingValue(""); 
        } else {
            console.error("El input está vacío.");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input 
                    className="form-control form-control-lg" 
                    type="text" 
                    placeholder="put your consuming here" 
                    aria-label=".form-control-lg example"
                    value={consumingValue} 
                    onChange={handleInputChange} 
                />
                <button type="submit" className="btn btn-primary mt-3">
                    Enviar Consumo
                </button>
            </form>

            <select className="form-select mt-3" aria-label="Default select example">
            <option selected>choose your type of consuming</option>
            {store.tiposConsumo && store.tiposConsumo.length > 0 ? (
                store.tiposConsumo.map((tipo, index) => (
                    <option key={index} value={tipo.id}>
                        {tipo.name} 
                    </option>
                ))
            ) : (
                <option disabled>Cargando...</option>
            )}
        </select>
        </div>
    );
}
export default TiposConsumo;