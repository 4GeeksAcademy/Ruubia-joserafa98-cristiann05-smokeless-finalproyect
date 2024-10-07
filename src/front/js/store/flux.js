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
                foto_usuario: ''
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
        },
        actions: {

            setStore: (newStore) => setStore((prevStore) => ({ ...prevStore, ...newStore })),

            getAllsmoker: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/smoker`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setStore({ smoker: data });
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
                        localStorage.setItem('token', data.token);

                        setStore({
                            loggedInUser: {
                                id: data.user_id || null, // Asegúrate de que este valor sea correcto
                                email: data.email_usuario || '',
                                nombre: data.nombre_usuario || '',
                                genero: data.genero_usuario || '',
                                cumpleaños: data.nacimiento_usuario || '',
                                foto_usuario: data.foto_usuario || '',
                            },
                            isAuthenticated: true,
                        });

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
                            foto_usuario: data.foto_usuario,
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
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coaches/${coachId}`);
                    const data = await response.json();
                    console.log(data);
                    setStore({ coach: data });
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

            // Login del coach
            loginCoach: async (coachData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/login-coach`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(coachData),
                    });

                    const data = await response.json();
                    console.log("Datos recibidos en loginCoach:", data);

                    if (response.ok) {
                        localStorage.setItem('token', data.token);
                        setStore({
                            loggedInCoach: {
                                id: data.coach_id || null,
                                nombre: data.nombre_coach || '',
                                genero: data.genero_coach || '',
                                cumpleaños: data.cumpleaños_coach || '',
                                foto: data.foto_coach || '' // Agregar la foto aquí
                            },
                            isAuthenticated: true,
                        });

                        return true;
                    } else {
                        console.error("Error en el login:", data.msg);
                        setStore({ isAuthenticated: false, loggedInCoach: null });
                        return false;
                    }
                } catch (error) {
                    console.error("Error en la solicitud de loginCoach:", error);
                    setStore({ isAuthenticated: false, loggedInCoach: null });
                    return false;
                }
            },

            // Obtener información del coach
            getCoachInfo: async (coachId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/coach_info/${coachId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
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


            // Logout
            logoutCoach: () => {
                localStorage.removeItem('token');
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
                            foto_usuario: data.secure_url,
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


            // solicitudes


            getAllSolicitudes: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/solicitudes`);
                    if (!response.ok) {
                        throw new Error("Error en la respuesta del servidor");
                    }
                    const data = await response.json();
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
                    // Resto del código...
                } catch (error) {
                    console.error("Error adding solicitud:", error);
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

                    // Actualiza la solicitud en el store y elimina de la lista
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
        },
    };
};

export default getState;