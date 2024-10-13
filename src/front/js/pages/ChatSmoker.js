import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Smile, Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import Sidebar from '../component/DasboardSmoker/Sidebar';
import Header from '../component/DasboardSmoker/Header';
import { Context } from '../store/appContext';

export default function EnhancedChatSmoker() {
  const { store, actions } = useContext(Context);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await actions.getAllCoaches();
      await actions.getAllSolicitudes();
    };
    fetchData();
  }, [actions]);

  useEffect(() => {
    if (selectedCoach) {
      fetchMessages();
    }
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId || !selectedCoach) {
      console.error('Faltan datos necesarios para obtener mensajes.');
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes/${userId}/${selectedCoach.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const mensajesData = await response.json();
        setMessages(mensajesData);
      } else {
        console.error('Error al obtener mensajes', response.status);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId || !selectedCoach) {
      console.error('Faltan datos necesarios para enviar el mensaje.');
      return;
    }

    const nuevoMensaje = {
      id_usuario: userId,
      id_coach: selectedCoach.id,
      contenido: newMessage,
    };

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/mensajes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoMensaje)
      });

      if (response.ok) {
        setNewMessage(''); // Clear the input after sending
        fetchMessages(); // Refresh messages after sending
      } else {
        const errorResponse = await response.json();
        console.error('Error al enviar el mensaje:', errorResponse);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
    }
  };

  const handleFileUpload = (type) => {
    // Implement file upload logic here
    console.log(`Uploading ${type}...`);
  };

  // Filter approved coaches
  const approvedSolicitudes = store.solicitudes.filter(solicitud => 
    solicitud.estado === true && 
    solicitud.fecha_respuesta !== null && 
    solicitud.id_usuario === store.loggedInUser.id
  );

  const approvedCoachIds = approvedSolicitudes.map(solicitud => solicitud.id_coach);
  const approvedCoaches = store.coaches.filter(coach => approvedCoachIds.includes(coach.id));

  // Function to handle coach selection
  const handleSelectCoach = (coach) => {
    setSelectedCoach(coach);
    setMessages([]); // Reset messages when a new coach is selected
    fetchMessages(); // Fetch messages for the newly selected coach
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar active="Chat" isDarkMode={isDarkMode} handleNavigation={(item) => navigate(item.path)} />
      <div className="flex-1 md:ml-64">
        <Header isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
        <div className="container mx-auto p-4">
          {/* Coach Photo Bar */}
          <div className="flex overflow-x-auto p-2 bg-gray-800 rounded-md mb-4 shadow-md">
            {approvedCoaches.map(coach => (
              <div key={coach.id} className="flex-shrink-0 mr-2 cursor-pointer transition-transform transform hover:scale-105" onClick={() => handleSelectCoach(coach)}>
                <img
                  src={coach.foto || 'default-avatar.png'} // Placeholder if no photo available
                  alt={coach.nombre_coach}
                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                />
              </div>
            ))}
          </div>

          <div className="flex h-[calc(100vh-120px)] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {/* Inbox */}
            <div className="w-1/3 border-r border-gray-700">
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Chats</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search coaches..."
                    className="w-full bg-gray-700 text-white rounded-full py-2 px-4 pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              <ul className="overflow-y-auto h-[calc(100%-80px)]">
                {approvedCoaches.map((coach) => (
                  <li
                    key={coach.id}
                    className={`p-4 cursor-pointer transition-colors duration-200 rounded-md ${
                      selectedCoach?.id === coach.id
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectCoach(coach)} // Use the new handler
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl font-bold mr-3">
                        {coach.nombre_coach.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{coach.nombre_coach}</h3>
                        <p className="text-sm text-gray-400">Last message preview...</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
              {selectedCoach ? (
                <>
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800 shadow-md">
                    <div className="flex items-center">
                      <img
                        src={selectedCoach.foto || 'default-avatar.png'} // Placeholder if no photo available
                        alt={selectedCoach.nombre_coach}
                        className="w-10 h-10 rounded-full border-2 border-gray-600 mr-3"
                      />
                      <div>
                        <h2 className="text-xl font-bold">{selectedCoach.nombre_coach}</h2>
                        <p className="text-sm text-gray-400">Online</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <Video size={20} />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`mb-4 ${msg.id_usuario === store.loggedInUser.id ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${msg.id_usuario === store.loggedInUser.id ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
                          <p>{msg.contenido}</p>
                          <span className="text-xs opacity-75 mt-1 block">
                            {new Date(msg.fecha_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="flex p-4 border-t border-gray-700 bg-gray-800">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 bg-gray-700 rounded-full py-2 px-4 text-white"
                    />
                    <button type="submit" className="ml-2 p-2 rounded-full bg-purple-600 hover:bg-purple-500 transition-colors duration-200">
                      <Send size={20} />
                    </button>
                    <button type="button" onClick={() => handleFileUpload('photo')} className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                      <Camera size={20} />
                    </button>
                    <button type="button" onClick={() => handleFileUpload('voice')} className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                      <Mic size={20} />
                    </button>
                    <button type="button" onClick={() => handleFileUpload('smiley')} className="ml-2 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                      <Smile size={20} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Select a coach to start chatting!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
