import { useNavigate } from 'react-router-dom';

const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smokers: [],
            tiposConsumo: [],
            coaches: [],
            loggedInUser: null,
            seguimiento: [],
            perfilCreado: false,
            isAuthenticated: false,
            userId: null,
            userInfo: null,
            solicitud: []
        },
        actions: {
            
            setStore: (newStore) => setStore((prevStore) => ({ ...prevStore, ...newStore })),
            getSmokers: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smokers`);
                    const data = await response.json();
                    setStore({ smokers: data });
                } catch (error) {
                    console.error("Error fetching smokers:", error);
                }
            },

            signupSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup-smoker`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });
            
                    console.log("Response:", response); // Muestra la respuesta completa
            
                    if (response.ok) {
                        const newSmoker = await response.json();
                        console.log("Nuevo usuario creado:", newSmoker); // Muestra los datos del nuevo usuario
                        
                        // No almacenar el token aquí
                        setStore({ smokers: [...getStore().smokers, newSmoker] }); // Actualiza el estado
                        
                        return true; // Retorna verdadero si la operación es exitosa
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData); // Muestra el error del servidor
                        return false; // Retorna falso si hay un error
                    }
                } catch (error) {
                    console.error("Error durante el registro del fumador:", error); // Muestra el error de la solicitud
                    return false; // Retorna falso si hay un error
                }
            },
            

            // Login de Smoker
            loginSmoker: async (smokerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-smoker`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(smokerData),
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        // Si el login es exitoso, almacena el token y actualiza el estado del store
                        localStorage.setItem('token', data.token);
            
                        setStore({
                            loggedInUser: {
                                id: data.user_id || null, // Asegúrate de que esto esté bien
                                email: data.email_usuario || '',
                                nombre: data.nombre_usuario || '',
                                genero: data.genero_usuario || '',
                                cumpleaños: data.nacimiento_usuario || '',
                            },
                            isAuthenticated: true,
                        });
            
                        return true; // Login exitoso
                    } else {
                        console.error("Error en el login:", data.msg);
                        return false; // Login fallido
                    }
                } catch (error) {
                    console.error("Error en la solicitud de login:", error);
                    return false; // Manejo de errores
                }
            },  

            // Actualizar el perfil
            updateProfile: async (userId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/create_profile/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(updatedData),
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore((prevStore) => ({
                            ...prevStore,
                            loggedInUser: {
                                ...prevStore.loggedInUser,
                                ...data.user
                            }
                        }));
                        localStorage.setItem("token", data.token); // Guardar el token en localStorage
            
                        setStore({
                            isAuthenticated: true,
                            userId: data.id,
                            nombreUsuario: data.nombre_usuario,
                            numerocigarro_usuario: data.numerocigarro_usuario,
                            periodicidad: data.periodicidad,
                            tipo_consumo: data.tipo_consumo,
                            fotoUsuario: data.foto_usuario,
                        });
            
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error actualizando perfil:", errorData.msg);
                        return false;
                    }
                } catch (error) {
                    console.error("Error updating profile:", error);
                    return false;
                }
            },       
            
            getUserInfo: async (userId) => { // Accept userId as a parameter
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/user_info/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Información del usuario:", data);
                        setStore({ userInfo: data }); // Actualiza el store con la información del usuario
                        return data; 
                    } else {
                        console.error("Error fetching user info:", response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                    return null;
                }
            },
                        

            updateConsumptionProfile: async (userId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/create_config_profile/${userId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify(updatedData),
                    });
            
                    if (response.ok) {
                        const data = await response.json();
                        setStore((prevStore) => ({
                            ...prevStore,
                            loggedInUser: {
                                ...prevStore.loggedInUser,
                                ...data.user
                            }
                        }));
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error actualizando consumo:", errorData.msg);
                        return false;
                    }
                } catch (error) {
                    console.error("Error updating consumption profile:", error);
                    return false;
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem('token'); // Obtener el token
                if (!token) {
                    console.error("No token found"); // Log para depuración
                    setStore({ isAuthenticated: false });
                    return false; // Retorna false si no hay token
                }

                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/protected`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Error en checkAuth:", response.statusText);
                        setStore({ isAuthenticated: false }); // Actualiza el store si la verificación falla
                        return false; // Retorna false si la verificación falla
                    }

                    const userData = await response.json(); // Obtener información del usuario
                    setStore({
                        isAuthenticated: true,
                        loggedInUser: userData, // Guardar la información del usuario
                    });

                    return true; // Retorna true si el token es válido
                } catch (error) {
                    console.error("Error en checkAuth:", error); // Log para depuración
                    setStore({ isAuthenticated: false });
                    return false; // Retorna false en caso de error
                }
            },

            logout: () => {
                localStorage.removeItem('token'); // Eliminar el token
                setStore({ loggedInUser: null, isAuthenticated: false }); // Actualizar el store
            },

            getAllCoaches: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`); // Ajusta la ruta según sea necesario
                    const data = await response.json();
                    setStore({ coaches: data }); // Actualiza el estado del store con los coaches obtenidos
                } catch (error) {
                    console.error("Error fetching coaches:", error); // Manejo de errores
                }
            },

            //SIGNUP COACH
            signupCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/signup-coach`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    if (response.ok) {
                        const newCoach = await response.json();
                        setStore({ coaches: [...getStore().coaches, newCoach] });
                        localStorage.setItem("token", newCoach.token);
                        return true;
                    } else {
                        const errorData = await response.json();
                        console.error("Error en la respuesta del servidor:", errorData);
                        return false;
                    }
                } catch (error) {
                    console.error("Error durante el registro del coach:", error);
                    return false;
                }
            },

            //login coach
            loginCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-coach`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setStore({
                            isAuthenticated: true,
                            coachId: data.coach_id,
                            nombre_coach: data.nombre_coach, // Nuevo campo
                            genero_coach: data.genero_coach, // Nuevo campo
                            foto_coach: data.foto_coach, // Nuevo campo
                        });
                        localStorage.setItem("token", data.token); // Guarda el token en localStorage
                        return true; // Indica que el login fue exitoso
                    } else {
                        const errorData = await response.json();
                        console.error("Error en el login del coach:", errorData);
                        return false; // Indica que el login falló
                    }
                } catch (error) {
                    console.error("Error durante el login del coach:", error);
                    return false; // Indica que hubo un error durante el proceso
                }
            },  
              // Método para subir la imagen del coach a Cloudinary
            uploadCoachImage: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "your_upload_preset"); // Reemplaza con tu preset de subida

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Error al subir la imagen");
                    }

                    const data = await response.json();
                    return data.secure_url; // Retorna la URL de la imagen subida
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null; // Retorna null si hay un error
                }
                
            },
            // Método para subir la imagen del smoker a Cloudinary
            uploadSmokerImage: async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "your_upload_preset"); // Reemplaza con tu preset de subida

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error("Error al subir la imagen");
                    }

                    const data = await response.json();
                    return data.secure_url; // Retorna la URL de la imagen subida
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null; // Retorna null si hay un error
                }
            },
        },
    };
};

export default getState;

