import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const TiposConsumo = ()=>{
    const { store, actions } = useContext(Context);
    const { tiposconsumo } = store;

    useEffect(() => {
        actions.getConsuming();
    }, []);

    return (
        <div className="container">
            <input class="form-control form-control-lg" type="text" placeholder="put your consuming here" aria-label=".form-control-lg example"></input>
            <select className="form-select" aria-label="Default select example">
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