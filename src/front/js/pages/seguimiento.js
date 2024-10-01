import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const FollowingList = () => {
    const { store, actions } = useContext(Context);

    // Al cargar el componente, obtenemos la lista de seguimientos
    useEffect(() => {
        actions.getFollowing();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Lista de Seguimientos</h1>
            {store.seguimiento && store.seguimiento.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Nombre del Usuario</th>
                            <th scope="col">cantidad de consumo</th>
                            <th scope="col">Sustancia</th>
                            {/* Aquí puedes agregar más columnas según la estructura de tu API */}
                        </tr>
                    </thead>
                    <tbody>
                        {store.seguimiento.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.nombre_usuario}</td>
                                <td>{item.cantidad}</td>
                                <td>{item.nombre_tipo}</td>
                                {/* Aquí puedes agregar más campos según los datos que recibes */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center">No hay seguimientos registrados.</p>
            )}
        </div>
    );
};

export default FollowingList;
