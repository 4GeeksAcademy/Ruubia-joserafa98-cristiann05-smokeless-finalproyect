const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            smoker: [],
            tiposConsumo: [],
            coaches: [],
            loggedInUser: {
                id: null,
                email: '',
                nombre: '',
                genero: '',
                cumpleaños: '',
                public_id: ''
            },
            loggedInCoach: {
                id: null,
                email: '',
                nombre: '',
                genero: '',
                cumpleaños: '',
                foto_coach: '',
                isProfileComplete: false  // Nueva propiedad que indica si el perfil está completo
            },
            seguimiento: [],
            perfilCreado: false,  // Refleja si el perfil del coach o usuario fue creado
            isAuthenticated: false, // Indica si el usuario o coach está autenticado
            userId: null,
            userInfo: null,
            coachInfo: null,
            solicitudes: [],
            consejo: [],
        },
        actions: {

            setStore: (newStore) => setStore((prevStore) => ({ ...prevStore, ...newStore })),

            getAllSmokers: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smoker`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Data received from API:", data); // Verifica aquí
                    setStore({ smoker: data });
                } catch (error) {
                    console.error("Error fetching smokers:", error);
                }
            },


            getSmoker: async (userId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smoker/${userId}`);
                    if (!response.ok) {
                        throw new Error(`Error HTTP! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log("Datos del usuario recibidos:", data); // Para verificar que recibes los datos correctos
                    setStore({ loggedInUser: { ...getStore().loggedInUser, ...data } }); // Actualiza la información del usuario
                } catch (error) {
                    console.error("Error fetching smoker:", error);
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
                        setStore({ smoker: [...getStore().smoker, newSmoker] }); // Actualiza el estado

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
                    console.log("Datos recibidos en loginSmoker:", data);

                    if (response.ok) {
                        // Almacena el token y el refresh token
                        localStorage.setItem('jwtToken', data.token);
                        localStorage.setItem('refreshToken', data.refresh_token); // Almacena el refresh token

                        // Almacena el ID del usuario
                        localStorage.setItem('userId', data.user_id || null);

                        // Actualiza el estado del usuario con la información recibida
                        setStore({
                            loggedInUser: {
                                id: data.user_id || null,
                                email: data.email_usuario || '',
                                nombre: data.nombre_usuario || '', // Asegúrate de que el servidor envíe este dato
                                genero: data.genero_usuario || '',
                                cumpleaños: data.nacimiento_usuario || '',
                                public_id: data.public_id || '',
                            },
                            isAuthenticated: true,
                        });

                        // Log para verificar el estado del store después de la actualización
                        console.log("Estado del store después del login:", getStore());

                        return true;
                    } else {
                        console.error("Error en el login:", data.msg);
                        setStore({ isAuthenticated: false, loggedInUser: null });
                        return false;
                    }
                } catch (error) {
                    console.error("Error en la solicitud de loginSmoker:", error);
                    setStore({ isAuthenticated: false, loggedInUser: null });
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
                            nombre_usuario: data.nombre_usuario,
                            numerocigarro_usuario: data.numerocigarro_usuario,
                            periodicidad: data.periodicidad,
                            tipo_consumo: data.tipo_consumo,
                            public_id: data.public_id,
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

            checkAuth: () => {
                const token = localStorage.getItem('token');

                if (token) {
                    setStore({
                        user: { token },
                    });
                }
            },

            // Logout
            logoutsmoker: () => {
                localStorage.removeItem('token');
                setStore({
                    loggedInUser: null,
                    isAuthenticated: false,
                    userId: null,
                    userInfo: null,
                });
            },

            // Obtener todos los coaches
            getAllCoaches: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches`);
                    const data = await response.json();
                    setStore({ coaches: data });
                } catch (error) {
                    console.error("Error fetching coaches:", error);
                }
            },

            // Obtener un coach específico
            getCoach: async (coachId) => {
                try {
                    const url = `${process.env.BACKEND_URL}/api/coaches/${coachId}`;
                    console.log("Fetching coach data from URL:", url); // Verifica la URL

                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`); // Manejar errores HTTP
                    }

                    const data = await response.json();
                    if (data) {
                        console.log("Coach data received:", data); // Verifica los datos recibidos
                        setStore({ coach: data });
                    } else {
                        console.error("No data received for coach.");
                    }
                } catch (error) {
                    console.error("Error fetching coach:", error);
                }
            },


            // Actualizar el perfil del coach
            updateProfileCoach: async (coachId, coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/create_profile/coach/${coachId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify(coachData),
                    });

                    const data = await response.json();
                    console.log('Datos recibidos en updateProfile:', data);

                    if (response.ok) {
                        setStore({
                            loggedInCoach: {
                                id: coachId,
                                nombre: data.coach.nombre_coach || '',
                                genero: data.coach.genero_coach || '',
                                cumpleaños: data.coach.nacimiento_coach || '',
                                foto: data.coach.foto_coach || '' // Agregar la foto aquí
                            }
                        });
                        return true;
                    } else {
                        console.error("Error actualizando perfil:", data.msg);
                        return false;
                    }
                } catch (error) {
                    console.error("Error en la solicitud de updateProfile:", error);
                    return false;
                }
            },

            // Registro del coach
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
                        console.log("Coach logueado:", data);

                        // Almacena el token
                        localStorage.setItem('jwtTokenCoach', data.token);

                        // Almacena el ID del usuario
                        localStorage.setItem('coachId', data.coach_id || null);

                        // Establecer el estado de autenticación
                        setStore({
                            isAuthenticated: true,
                            loggedInCoach: {
                                id: data.coach_id,
                                email: data.email,
                                nombre: data.nombre,
                                genero: data.genero,
                                cumpleaños: data.cumpleaños,
                                foto_coach: data.foto_coach,
                                isProfileComplete: data.isProfileComplete || false,
                            }
                        });

                        return data; // Retornar los datos del coach
                    } else {
                        console.error("Error al iniciar sesión:", response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error("Error en el login:", error);
                    return null;
                }
            },

            async getToken() {
                return localStorage.getItem('jwtTokenCoach'); // Devuelve el token del localStorage
            },

            getCoachInfo: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coach_info/${coachId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("jwtTokenCoach")}`, // Usa el token correcto aquí
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Información del coach:", data);
                        setStore({ coachInfo: data }); // Actualiza el store con la información del coach
                        return data;
                    } else {
                        console.error("Error al obtener información del coach:", response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error("Error al obtener información del coach:", error);
                    return null;
                }
            },

            setCurrentUser: (coachInfo) => {
                setStore({ loggedInCoach: coachInfo }); // Actualiza el estado global con la información del coach
            },

            logoutCoach: () => {
                localStorage.removeItem('jwtTokenCoach');
                setStore({
                    loggedInCoach: null,
                    isAuthenticated: false,
                    coachInfo: null,
                });
            },


            // Método para subir la imagen del coach a Cloudinary
            uploadCoachImage: async (file) => {
                if (!file || !file.type.startsWith('image/')) {
                    console.error("El archivo no es una imagen válida.");
                    return null; // Retorna null si el archivo no es válido
                }

                const maxSize = 2 * 1024 * 1024; // 2 MB
                if (file.size > maxSize) {
                    console.error("El archivo es demasiado grande. Debe ser menor a 2 MB.");
                    return null;
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET); // Asegúrate de usar el preset correcto

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error al subir la imagen: ${errorData.message}`);
                    }

                    const data = await response.json();
                    console.log("Respuesta de Cloudinary:", data); // Verifica la respuesta

                    const imageUrl = data.secure_url; // Obtén la URL de la respuesta de Cloudinary

                    // Enviar la URL a tu API
                    const apiResponse = await fetch(`/api/coaches/upload_image/${coachId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ imageUrl }),
                    });

                    if (!apiResponse.ok) {
                        const apiError = await apiResponse.json();
                        console.error("Error al enviar la imagen a la API:", apiError);
                    }

                    // Actualiza el store con la URL de la imagen
                    setStore((prevStore) => ({
                        ...prevStore,
                        loggedInCoach: {
                            ...prevStore.loggedInCoach,
                            foto_coach: imageUrl, // Asegúrate de que el campo sea correcto
                        }
                    }));

                    return data;
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null;
                }
            },

            // Método para subir la imagen del smoker a Cloudinary
            uploadSmokerImage: async (file) => {
                if (!file || !file.type.startsWith('image/')) {
                    console.error("El archivo no es una imagen válida.");
                    return null;
                }

                const maxSize = 2 * 1024 * 1024; // 2 MB
                if (file.size > maxSize) {
                    console.error("El archivo es demasiado grande. Debe ser menor a 2 MB.");
                    return null;
                }

                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET); // Asegúrate de usar el preset correcto

                try {
                    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
                        method: "POST",
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error al subir la imagen: ${errorData.message}`);
                    }

                    const data = await response.json();
                    // Actualiza el store con la URL de la imagen
                    setStore((prevStore) => ({
                        ...prevStore,
                        loggedInUser: {
                            ...prevStore.loggedInUser,
                            public_id: data.secure_url,
                        }
                    }));

                    return data;
                } catch (error) {
                    console.error("Error uploading image:", error);
                    return null;
                }
            },
            getCoachesLocations: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/ubicaciones`); // Ajusta la ruta según sea necesario
                    const data = await response.json();
                    setStore({ coachesLocations: data }); // Actualiza el estado del store con las ubicaciones obtenidas
                } catch (error) {
                    console.error("Error fetching coaches locations:", error);
                }
            },
            addCoachLocation: async (coachId, locationData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/ubicaciones`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ coach_id: coachId, ...locationData }),
                    });

                    if (response.ok) {
                        const newLocation = await response.json();
                        setStore({ coachesLocations: [...getStore().coachesLocations, newLocation] }); // Actualiza el estado
                        return true; // Retorna verdadero si la operación es exitosa
                    } else {
                        const errorData = await response.json();
                        console.error("Error al agregar ubicación:", errorData); // Muestra el error del servidor
                        return false; // Retorna falso si hay un error
                    }
                } catch (error) {
                    console.error("Error durante la adición de ubicación:", error); // Muestra el error de la solicitud
                    return false; // Retorna falso si hay un error
                }
            },
            deleteCoachLocation: async (locationId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/ubicaciones/${locationId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    if (response.ok) {
                        setStore({ coachesLocations: getStore().coachesLocations.filter(location => location.id !== locationId) }); // Actualiza el estado
                        return true; // Retorna verdadero si la operación es exitosa
                    } else {
                        const errorData = await response.json();
                        console.error("Error al eliminar ubicación:", errorData); // Muestra el error del servidor
                        return false; // Retorna falso si hay un error
                    }
                } catch (error) {
                    console.error("Error durante la eliminación de ubicación:", error); // Muestra el error de la solicitud
                    return false; // Retorna falso si hay un error
                }
            },


            //solicitudes
            getAllSolicitudes: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
                    console.log("Data received from solicitudes:", data); // Verifica aquí
                    setStore({ solicitudes: data }); // Guarda todas las solicitudes en el store
                } catch (error) {
                    console.error("Error fetching solicitudes:", error);
                }
            },


            // Obtener solicitudes por usuario específico
            getSolicitudesPorUser: async (userId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes/usuario/${userId}`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
                    console.log("probando data", data)
                    setStore({ solicitudes: data }); // Guarda las solicitudes del usuario en el store
                } catch (error) {
                    console.error("Error fetching solicitudes por usuario:", error);
                }
            },


            addSolicitud: async (newSolicitud) => {
                console.log("Datos a enviar:", newSolicitud); // Agrega esta línea para depurar
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newSolicitud),
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        alert(errorData.error); // Mostrar mensaje de error si la solicitud ya existe
                        return;
                    }
            
                    const data = await response.json();
                    console.log("Solicitud creada:", data);
                    // Puedes manejar el estado de éxito aquí, si es necesario.
                    
                } catch (error) {
                    console.error("Error al agregar solicitud:", error);
                }
            },
            


            // Actualizar una solicitud específica
            updateSolicitud: async (solicitudId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes/${solicitudId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });
                    if (!response.ok) {
                        throw new Error("Error al actualizar la solicitud");
                    }

                    const data = await response.json();

                    setStore((prevStore) => ({
                        ...prevStore,
                        solicitudes: prevStore.solicitudes.map((solicitud) =>
                            solicitud.id === solicitudId ? { ...solicitud, ...updatedData } : solicitud
                        ),
                    }));
                } catch (error) {
                    console.error("Error updating solicitud:", error);
                }
            },



            // Eliminar una solicitud específica
            deleteSolicitud: async (solicitudId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes/${solicitudId}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error("Error al eliminar la solicitud");
                    }

                    // Actualiza el estado en el store después de eliminar la solicitud
                    setStore((prevStore) => ({
                        ...prevStore,
                        solicitudes: prevStore.solicitudes.filter((solicitud) => solicitud.id !== solicitudId),
                    }));
                } catch (error) {
                    console.error("Error deleting solicitud:", error);
                }
            },


            getTiposConsumo: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/tiposconsumo`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
                    setStore({ tiposConsumo: data });
                } catch (error) {
                    console.error("Error fetching tipos de consumo:", error);
                }
            },

            // generarConsejo: async (userId) => {
            //     try {
            //         // Obtener los datos del usuario desde el store
            //         const store = getStore();
            //         const userInfo = store.userInfo; // Asegúrate de que userInfo no sea nulo
            
            //         console.log("Información del usuario:", userInfo);
            
            //         // Verifica que los datos del usuario estén completos
            //         if (!userInfo) {
            //             console.error("userInfo es null o undefined. Asegúrate de haber obtenido los datos del usuario.");
            //             alert("No se pudo encontrar información del usuario. Por favor, intenta de nuevo.");
            //             return; // Sale de la función si no hay información del usuario
            //         }
            
            //         // Asegúrate de que estos valores existan antes de usarlos
            //         const { tiempo_fumando, numero_cigarrillos, periodicidad_consumo } = userInfo;
            
            //         if (!tiempo_fumando || !numero_cigarrillos || !periodicidad_consumo) {
            //             console.error("Los datos del usuario son incompletos.");
            //             alert("Por favor, completa tu información antes de solicitar un consejo.");
            //             return; // Sale de la función si los datos no son válidos
            //         }
            
            //         const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
            
            //         const response = await fetch('https://api.openai.com/v1/chat/completions', {
            //             method: 'POST',
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 'Authorization': `Bearer ${apiKey}`,
            //             },
            //             body: JSON.stringify({
            //                 model: 'gpt-3.5-turbo',
            //                 messages: [
            //                     {
            //                         role: 'user',
            //                         content: `Soy un fumador que ha estado fumando durante ${tiempo_fumando} años. Fumo ${numero_cigarrillos} cigarrillos al día y consumo de forma ${periodicidad_consumo}. ¿Puedes darme un consejo sobre cómo dejar de fumar?`
            //                     }
            //                 ]
            //             }),
            //         });
            
            //         if (!response.ok) {
            //             const errorDetails = await response.text();
            //             throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails}`);
            //         }
            
            //         const data = await response.json();
            //         console.log("Consejo recibido de la API:", data);
            
            //         // Actualiza el consejo en el store
            //         setStore({
            //             ...getStore(),
            //             userInfo: {
            //                 ...userInfo,
            //                 consejo: data.choices[0].message.content
            //             }
            //         });
            
            //     } catch (error) {
            //         console.error("Error fetching consejo:", error.message);
            //     }
            // },
            

        },
    };
};

export default getState;