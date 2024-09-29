import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

const TiposConsumo = ()=>{
    const { store, actions } = useContext(Context);
    const { tiposconsumo } = store;
    const [consumingValue, setConsumingValue] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingValue, setEditingValue] = useState("");

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
    const handleDelete = (id) => {
        actions.deleteConsuming(id);  
    };
    const handleEdit = (id, name) => {
        setEditingId(id); 
        setEditingValue(name); 
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingValue.trim()) {
            actions.updateConsuming(editingId, { name: editingValue });  
            setEditingId(null);  
            setEditingValue(""); 
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

            <select className="form-select mt-3" aria-label="Default select example" >
                <option value="" disabled>choose your type of consuming</option>
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

            {editingId && (
                <form onSubmit={handleEditSubmit} className="mt-3">
                    <input 
                        className="form-control form-control-lg" 
                        type="text" 
                        value={editingValue} 
                        onChange={(e) => setEditingValue(e.target.value)} 
                    />
                    <button type="submit" className="btn btn-success mt-3">
                        Guardar Cambios
                    </button>
                </form>
            )}

            <ul className="list-group mt-3">
                {store.tiposConsumo && store.tiposConsumo.length > 0 ? (
                    store.tiposConsumo.map((tipo, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {tipo.name}

                            <div>
                                <button 
                                    className="btn btn-warning btn-sm mx-2" 
                                    onClick={() => handleEdit(tipo.id, tipo.name)}
                                >
                                    Editar
                                </button>
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleDelete(tipo.id)}
                                >
                                    Borrar
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="list-group-item">Cargando...</li>
                )}
            </ul>
        </div>
    );
}
export default TiposConsumo;