import React from 'react';
import { usePage } from '@inertiajs/react';
import { Award, BarChart2, Calendar as CalendarIcon, Clock, Eye, Heart, Home, MapPin, Search, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Configurar el localizador con moment y establecer el idioma español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Actualizar estilos del calendario para mejorar visibilidad en diferentes vistas
const calendarStyles = {
  // Estilo general del calendario
  calendar: {
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    fontFamily: 'inherit',
    height: '100%',
    color: '#1f2937' // Color base para todo el texto
  },
  // Estilos para la cabecera y botones de navegación
  toolbar: {
    backgroundColor: '#f3f4f6',
    padding: '0.75rem',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    color: '#1f2937'
  },
  // Estilos para las celdas del calendario
  month: {
    backgroundColor: '#fff',
    color: '#4b5563'
  },
  // Estilos para el día actual
  today: {
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    fontWeight: 'bold'
  },
  // Estilos para eventos
  event: {
    borderRadius: '0.25rem',
    padding: '0.25rem 0.5rem',
    fontSize: '0.875rem',
    margin: '1px 0',
    fontWeight: 500
  },
  // Día seleccionado
  selectedDate: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd'
  },
  // Vista semanal
  week: {
    backgroundColor: '#fff',
    color: '#1f2937'
  },
  // Vista diaria
  day: {
    backgroundColor: '#fff',
    color: '#1f2937'
  },
  // Agendas y listas
  agenda: {
    backgroundColor: '#fff',
    color: '#1f2937',
    fontSize: '0.9rem'
  }
};

export default function Dashboard() {
    const { auth } = usePage().props;
    const [selectedMunicipio, setSelectedMunicipio] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isProyectosModalOpen, setIsProyectosModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('actividades');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        titulo: '',
        fecha: '',
        hora: '',
        municipio: '',
        tipo: 'formulacion',
        estado: 'pendiente'
    });

    // Para el carrusel de secciones
    const sectionRefs = useRef([]);

    // Datos de ejemplo para municipios y proyectos
    const municipiosConProyectos = [
        {
            id: 1,
            nombre: 'Agua chica',
            proyectosFormulacion: 5,
            imagen: '/ruta/imagen1.jpg',
        },
        {
            id: 2,
            nombre: 'Municipio B',
            proyectosFormulacion: 3,
            imagen: '/ruta/imagen2.jpg',
        },
        {
            id: 3,
            nombre: 'Municipio C',
            proyectosFormulacion: 7,
            imagen: '/ruta/imagen3.jpg',
        },
    ];

    const proyectosEjecucion = [
        {
            id: 1,
            nombre: 'Construcción Escuela Municipal',
            municipio: 'Agua Chica',
            avance: 45,
            estado: 'En proceso',
        },
        {
            id: 2,
            nombre: 'Pavimentación Calle Principal',
            municipio: 'San Juan',
            avance: 75,
            estado: 'Avanzado',
        },
        {
            id: 3,
            nombre: 'Centro de Salud Comunitario',
            municipio: 'Villa Nueva',
            avance: 25,
            estado: 'Inicial',
        },
        {
            id: 4,
            nombre: 'Parque Ecológico Municipal',
            municipio: 'La Esperanza',
            avance: 60,
            estado: 'En proceso',
        },
    ];

    // Eventos de ejemplo más completos
    const eventos = [
        {
            id: 1,
            titulo: 'Formulación Proyecto Escuela',
            fecha: '2023-09-15',
            municipio: 'Agua Chica',
            tipo: 'formulacion',
            estado: 'pendiente',
            hora: '09:00',
        },
        {
            id: 2,
            titulo: 'Presentación Proyecto Vial',
            fecha: '2023-09-20', 
            municipio: 'San Juan',
            tipo: 'presentacion',
            estado: 'completado',
            hora: '10:00',
        },
        {
            id: 3,
            titulo: 'Visita Técnica',
            fecha: '2023-09-17',
            municipio: 'Villa Nueva',
            tipo: 'otro',
            estado: 'pendiente',
            hora: '14:30',
        },
        {
            id: 4,
            titulo: 'Reunión de Seguimiento',
            fecha: '2023-09-21',
            municipio: 'Santa Elena',
            tipo: 'formulacion',
            estado: 'pendiente',
            hora: '11:00',
        },
        {
            id: 5,
            titulo: 'Entrega de Documentación',
            fecha: '2023-09-25',
            municipio: 'La Esperanza',
            tipo: 'presentacion',
            estado: 'pendiente',
            hora: '09:30',
        }
    ];

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    function ajustarFecha(fecha) {
        const [year, month, day] = fecha.split('-').map(Number);
        return new Date(year, month - 1, day, 12, 0, 0);
    }

    function mesAnterior() {
        const nuevaFecha = new Date(currentDate);
        nuevaFecha.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(nuevaFecha);
    }

    function mesSiguiente() {
        const nuevaFecha = new Date(currentDate);
        nuevaFecha.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(nuevaFecha);
    }

    const eventosMesActual = eventos.filter((evento) => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getMonth() === currentDate.getMonth() && fechaEvento.getFullYear() === currentDate.getFullYear();
    });

    // Proyectos por municipio
    const proyectosPorMunicipio = {
        'Municipio A': [
            {
                id: 1,
                nombre: 'Construcción Escuela Primaria',
                sector: 'Educación',
                presupuesto: '1,500,000',
                estado: 'En revisión',
                fechaInicio: '2024-03-15',
            },
            {
                id: 2,
                nombre: 'Parque Municipal Fase I',
                sector: 'Recreación',
                presupuesto: '800,000',
                estado: 'Pendiente',
                fechaInicio: '2024-04-01',
            },
        ],
        'Municipio B': [
            {
                id: 3,
                nombre: 'Mejoramiento Vial Calle Principal',
                sector: 'Infraestructura',
                presupuesto: '2,300,000',
                estado: 'En revisión',
                fechaInicio: '2024-03-20',
            },
        ],
    };

    const handleMunicipioClick = (municipio) => {
        // Si el municipio tiene la propiedad proyectosFormulados, estamos tratando con un municipio de formulación
        if ('proyectosFormulados' in municipio) {
            // Aquí podrías buscar más detalles sobre este municipio si es necesario
            const proyectosDelMunicipio = proyectosPorMunicipio[municipio.nombre] || [];
            setSelectedMunicipio({
                ...municipio,
                // Asegúrate de que tenga todas las propiedades necesarias para el modal
                proyectosActivos: municipio.proyectosFormulados,
            });
        } else {
            // Este es el manejo original para los otros municipios
        setSelectedMunicipio(municipio);
        }

        setIsProyectosModalOpen(true);
    };

    // Para cambiar automáticamente entre secciones (carrusel)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSectionIndex((prev) => (prev === 3 ? 0 : prev + 1));
        }, 30000); // Cambio cada 30 segundos

        return () => clearInterval(interval);
    }, []);

    // Para refrescar datos cada cierto tiempo
    useEffect(() => {
        const interval = setInterval(
            () => {
                // Aquí iría una llamada para actualizar datos
                console.log('Refrescando datos...');
            },
            5 * 60 * 1000,
        ); // Cada 5 minutos

        return () => clearInterval(interval);
    }, []);

    // Función para pantalla completa
    const toggleFullscreen = () => {
        if (!isFullscreen) {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    // Componente para el menú lateral
    const SideNavbar = () => {
        return (
            <div className="fixed top-0 bottom-0 left-0 flex h-screen w-[80px] flex-col items-center bg-indigo-600 py-6">
                {/* Perfil de usuario */}
                <div className="mb-8 flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-white/20">
                        <img
                            src="/ingeer.png"
                            alt="Perfil de usuario"
                            className="h-full w-full object-cover rounded-full bg-transparent p-1"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                            }}
                        />
                    </div>
                   
                </div>

                {/* Navegación principal */}
                <div className="flex flex-col space-y-8">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md">
                        <Home className="h-6 w-6" />
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-indigo-500">
                        <CalendarIcon className="h-6 w-6" />
                    </button>
                    <button className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-indigo-500">
                        <BarChart2 className="h-6 w-6" />
                    </button>
                    
                </div>

                {/* Configuración (en la parte inferior) */}
                <div className="mt-auto">
                    <button className="flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-indigo-500">
                        <Settings className="h-6 w-6" />
                    </button>
                </div>
            </div>
        );
    };

    // En la sección de datos simulados, justo después de otros datos como proyectosFormulacion, proyectosEjecucion, etc.
    const municipiosFormulacion = [
        { id: 1, nombre: 'Agua chica', proyectosFormulados: 5, avance: 70 },
        { id: 2, nombre: 'San Juan', proyectosFormulados: 3, avance: 45 },
        { id: 3, nombre: 'Villa Nueva', proyectosFormulados: 7, avance: 90 },
        { id: 4, nombre: 'Santa Elena', proyectosFormulados: 2, avance: 30 },
        { id: 5, nombre: 'La Esperanza', proyectosFormulados: 4, avance: 60 },
    ];

    // Componente para la tarjeta de municipios con formulación
    const MunicipiosFormulacionCard = ({ municipios, onMunicipioClick }) => {
    return (
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="p-5">
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Municipios con Proyectos en Formulación</h3>
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                            {municipios.reduce((total, mun) => total + mun.proyectosFormulados, 0)} proyectos
                        </span>
                    </div>

                    <div className="space-y-4">
                        {municipios.map((municipio) => (
                            <div 
                                key={municipio.id}
                                className="cursor-pointer rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                                onClick={() => onMunicipioClick(municipio)}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-2">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-medium text-gray-800">{municipio.nombre}</h4>
                                </div>
                                    <span className="rounded-full bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700">
                                        {municipio.proyectosFormulados} proyectos
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="h-2 flex-1 rounded-full bg-gray-100">
                                        <div className="h-2 rounded-full bg-blue-500" style={{ width: `${municipio.avance}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{municipio.avance}% completado</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 text-center">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver todos los municipios</button>
                    </div>
                </div>
            </div>
        );
    };

    // Convertir eventos al formato esperado por react-big-calendar
    const calendarEvents = eventos.map(evento => ({
        id: evento.id,
        title: evento.titulo,
        start: new Date(evento.fecha + 'T' + evento.hora),
        end: moment(evento.fecha + 'T' + evento.hora).add(1, 'hours').toDate(),
        municipio: evento.municipio,
        tipo: evento.tipo,
        estado: evento.estado
    }));
    
    // Función para manejar click en evento
    const handleEventSelect = (event) => {
        setSelectedEvent(event);
        // Aquí podrías mostrar un modal con detalles del evento
    };
    
    // Personalización de los eventos en el calendario con colores más visibles
    const eventPropGetter = (event) => {
        let backgroundColor = '#3B82F6'; // azul por defecto
        let textColor = '#FFFFFF';
        
        if (event.tipo === 'presentacion') {
            backgroundColor = '#F59E0B'; // ámbar
        } else if (event.tipo === 'formulacion') {
            backgroundColor = '#6366F1'; // índigo
        } else if (event.tipo === 'otro') {
            backgroundColor = '#8B5CF6'; // violeta
        }
        
        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: event.estado === 'completado' ? 0.7 : 1,
                color: textColor,
                border: '0px',
                display: 'block',
                fontWeight: 'bold',
                padding: '2px 5px',
                fontSize: '0.8rem'
            }
        };
    };
    
    // Personalización de las celdas del calendario
    const dayPropGetter = (date) => {
        const today = new Date();
        const isToday = date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();
        
        // Estilo para el día actual
        if (isToday) {
            return {
                style: {
                    backgroundColor: '#eff6ff',
                    color: '#1f2937',
                    fontWeight: 'bold'
                }
            };
        }
        
        return {};
    };

    // Función para manejar los cambios en el formulario
    const handleEventFormChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Función para agregar un nuevo evento
    const handleAddEvent = () => {
        // Validación básica
        if (!newEvent.titulo || !newEvent.fecha || !newEvent.hora || !newEvent.municipio) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        // Crear nuevo evento con ID único
        const nuevoEvento = {
            id: eventos.length + 1,
            ...newEvent
        };
        
        // Agregar el evento a la lista
        const eventosActualizados = [...eventos, nuevoEvento];
        // En una aplicación real, aquí harías una llamada a la API
        
        // Actualizar el estado
        eventos.push(nuevoEvento); // Actualizar la referencia directa para este ejemplo
        
        // Actualizar eventos del calendario
        const nuevoEventoCalendario = {
            id: nuevoEvento.id,
            title: nuevoEvento.titulo,
            start: new Date(nuevoEvento.fecha + 'T' + nuevoEvento.hora),
            end: moment(nuevoEvento.fecha + 'T' + nuevoEvento.hora).add(1, 'hours').toDate(),
            municipio: nuevoEvento.municipio,
            tipo: nuevoEvento.tipo,
            estado: nuevoEvento.estado
        };
        
        calendarEvents.push(nuevoEventoCalendario);
        
        // Restablecer formulario
        setNewEvent({
            titulo: '',
            fecha: '',
            hora: '',
            municipio: '',
            tipo: 'formulacion',
            estado: 'pendiente'
        });
        
        // Cerrar formulario
        setShowEventForm(false);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Menú lateral */}
                <SideNavbar />

                {/* Contenido principal con margen izquierdo para acomodar el menú */}
                <div className="ml-[80px] min-h-screen">
                    <div className="flex h-full flex-col">
                        {/* Barra superior */}
                        <div className="flex items-center justify-between bg-white p-6 shadow-sm">
                            <div>
                                <h1 className="text-sm text-gray-800 font-bold">Gestión de Proyectos</h1>
                                <h2 className="text-sm text-gray-800">Dashboard de Actividades</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar proyectos"
                                        className="w-56 rounded-full border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                {/* Información del usuario */}
                                <div className="relative flex items-center gap-3 pr-2">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm text-gray-500">{auth?.user?.name || 'Ana Martínez'}</span>
                                        <span className="text-xs text-gray-500">{auth?.user?.role || 'Administrador'}</span>
                                    </div>
                                    <div className="relative">
                                        <button
                                            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100"
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        >
                                            <img
                                                src="/path/to/profile-image.jpg"
                                                alt="Perfil de usuario"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
                                                }}
                                            />
                                        </button>
                                        {/* Badge de notificaciones */}
                                        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
                                            3
                                        </div>
                                    </div>

                                    {/* Menú desplegable */}
                                    {userMenuOpen && (
                                        <div className="ring-opacity-5 absolute top-full right-0 z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black">
                                            <div className="py-1">
                                                <div className="border-b border-gray-100 px-4 py-3">
                                                    <p className="text-sm leading-5 text-gray-600">Conectado como</p>
                                                    <p className="truncate text-sm leading-5 font-medium text-gray-900">
                                                        {auth?.user?.email || 'ana.martinez@ejemplo.com'}
                                                    </p>
                                                </div>
                                                <a href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Mi Perfil
                                                </a>
                                                <a href="/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Configuración
                                                </a>
                                                <a href="/mis-proyectos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Mis Proyectos
                                                </a>
                                                <a href="/actividad-reciente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Actividad reciente
                                                </a>
                                                <div className="border-t border-gray-100"></div>
                                                <a href="/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                    Cerrar sesión
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contenido del dashboard */}
                        <div className="relative flex-1 overflow-hidden p-6 transition-all duration-500">
                            <div className="flex flex-1 gap-4 p-4">
                                {/* Panel izquierdo */}
                                <div className="flex w-[65%] flex-col gap-4">
                                    {/* Reemplazar la sección de Progreso Semanal con cards de municipios */}
                                    <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 shadow-lg">
                                        <div className="mb-6 flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-white">Municipios con Proyectos en Formulación</h3>
                                            <div className="rounded-lg bg-white/20 px-3 py-1 backdrop-blur-sm">
                                                <span className="text-sm text-white">{municipiosFormulacion.length} municipios</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            {municipiosFormulacion.map((municipio) => (
                                                <div
                                                    key={municipio.id}
                                                    onClick={() => handleMunicipioClick(municipio)}
                                                    className="group transform cursor-pointer rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                                                >
                                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white group-hover:bg-white/30">
                                                        <MapPin className="h-5 w-5" />
                                                    </div>
                                                    <h4 className="mb-1 text-lg font-semibold text-white">{municipio.nombre}</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-white/80">{municipio.proyectosFormulados} proyectos</span>
                                                        <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white">
                                                            {municipio.avance}%
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                                                        <div
                                                            className="h-full rounded-full bg-white transition-all duration-500"
                                                            style={{ width: `${municipio.avance}%` }}
                                                        ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                                        <div className="mt-6 flex justify-center">
                                            <button className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30">
                                                <Eye className="h-4 w-4" />
                                                Ver todos los municipios
                                            </button>
                </div>
            </div>

                                    {/* Proyectos */}
                                </div>

                                {/* Panel derecho */}
                                <div className="flex w-[35%] flex-col gap-4">
                                    {/* Proyectos en ejecución - VERSIÓN SIMPLIFICADA */}
                                    <div className="rounded-lg bg-white p-4 shadow-sm">
                                        <h3 className="mb-4 text-lg font-bold text-gray-800">Proyectos en Ejecución</h3>

                                        <div>
                                            {proyectosEjecucion.slice(0, 3).map((proyecto) => (
                                                <div key={proyecto.id} className="mb-4 rounded border p-3 transition-colors hover:bg-gray-50">
                                                    <h4 className="font-medium text-gray-800">{proyecto.nombre}</h4>
                                                    <p className="text-sm text-gray-600">{proyecto.municipio}</p>
                                                    <div className="mt-2 h-2 rounded-full bg-gray-200">
                                                        <div
                                                            className={`h-2 rounded-full ${
                                                                proyecto.avance >= 75
                                                                    ? 'bg-green-500'
                                                                    : proyecto.avance >= 40
                                                                    ? 'bg-blue-500'
                                                                    : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${proyecto.avance}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="mt-1 flex justify-between">
                                                        <span className="text-xs text-gray-500">{proyecto.estado}</span>
                                                        <span className="text-sm font-medium text-gray-700">{proyecto.avance}%</span>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="text-center">
                                                <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                                    <Eye className="h-4 w-4" />
                                                    Ver todos los proyectos
            </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel inferior eventos*/}
                            </div>

                            <div className="flex flex-1 gap-4 p-4">
                                <div className="flex w-[100%] flex-col gap-4">
                                    {/* Eventos próximos - actualizado para usar datos reales del array de eventos */}
                                    <div className="relative overflow-hidden rounded-xl bg-pink-50 p-5 shadow-sm">
                                        {/* Fondo decorativo */}
                                        <div className="absolute top-0 right-0 h-full w-2/3 opacity-10">
                                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fill="#9F3A5D"
                                                    d="M42,-57.1C54.9,-47.3,66.5,-35.6,71.5,-21.6C76.5,-7.5,75,9,68.5,22.5C62,36,50.4,46.5,37.5,54.8C24.6,63.1,10.3,69.2,-3.9,70C-18.1,70.7,-36.2,66.2,-49.2,55.9C-62.2,45.6,-70.2,29.6,-74,11.7C-77.8,-6.2,-77.4,-26,-68.6,-41.3C-59.7,-56.6,-42.3,-67.5,-26.1,-70.9C-9.8,-74.4,5.4,-70.4,19.4,-64.5C33.4,-58.5,47.2,-50.7,55.9,-40.8C64.6,-30.9,68.4,-19,61.2,-10.2C53.9,-1.5,35.7,4,29.1,11.5C22.4,19,27.3,28.5,27.6,40.4C27.9,52.3,23.5,66.5,15.1,71.8C6.7,77,-5.7,73.2,-16.8,68.4C-27.9,63.6,-37.7,57.8,-48.8,51.1C-59.9,44.5,-72.3,37.1,-79.3,25.7C-86.3,14.3,-88,0,-83,-11.1C-78,-22.1,-66.3,-29.8,-54.8,-36.5C-43.4,-43.2,-32.2,-48.9,-20.6,-55.6C-9.1,-62.3,2.9,-70,15.1,-70.8C27.3,-71.5,39.7,-65.3,42,-57.1Z"
                                                    transform="translate(100 100)"
                                                />
                                            </svg>
                                        </div>

                                        <div className="relative z-10 mb-4 flex items-center justify-between">
                                            <h3 className="mb-4 text-lg font-bold text-gray-800">Próximos Eventos</h3>
                                <button
                                                onClick={() => setIsCalendarModalOpen(true)}
                                                className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Ver todos los eventos
                                </button>
                                        </div>

                                        <div className="relative z-10 mt-4 space-y-3">
                                            {eventos.length > 0 ? (
                                                eventos.map(evento => {
                                                    const fechaEvento = new Date(evento.fecha);
                                                    const dia = fechaEvento.getDate();
                                                    const diaSemana = fechaEvento.toLocaleDateString('es-ES', { weekday: 'long' });
                                                    const mes = meses[fechaEvento.getMonth()];
                                                    
                                                    return (
                                                        <div key={evento.id} className="flex overflow-hidden rounded-lg border border-indigo-200 bg-white">
                                                <div className="flex w-24 flex-col items-center justify-center bg-indigo-400 p-3 text-white">
                                                                <span className="text-sm uppercase">{diaSemana}</span>
                                                                <span className="text-4xl font-bold">{dia}</span>
                                                                <span className="text-xs">{mes}</span>
                                                </div>
                                                <div className="flex flex-1 items-center p-4">
                                                    <div className="flex items-center gap-2">
                                                                    <div className={`p-2 rounded-full 
                                                                        ${evento.tipo === 'formulacion' ? 'bg-indigo-100 text-indigo-600' : 
                                                                          evento.tipo === 'presentacion' ? 'bg-amber-100 text-amber-600' : 
                                                                          'bg-purple-100 text-purple-600'}`}>
                                                            <Clock className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                                        <h4 className="font-medium text-gray-800">{evento.titulo}</h4>
                                                    <div className="flex items-center gap-2">
                                                                            <p className="text-gray-600">{evento.hora}</p>
                                                                            <span className="text-xs px-2 py-0.5 rounded-full 
                                                                                ${evento.estado === 'pendiente' ? 'bg-blue-100 text-blue-800' : 
                                                                                  evento.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                                                                                  'bg-gray-100 text-gray-800'}">
                                                                                {evento.municipio}
                                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex justify-center items-center p-6 text-gray-500">
                                                    No hay eventos próximos programados
                                                </div>
                                            )}
                                            
                                            {/* Mostrar mensaje si hay menos de 3 eventos */}
                                            {eventos.length > 0 && eventos.length < 3 && (
                                                <div className="flex justify-center items-center p-4 border border-dashed border-indigo-200 rounded-lg">
                                                    <button 
                                                        onClick={() => setIsCalendarModalOpen(true)} 
                                                        className="text-indigo-600 flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Agregar nuevo evento
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para detalles de municipio */}
            {isProyectosModalOpen && selectedMunicipio && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
                        <div className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedMunicipio.nombre}</h2>
                                    <p className="text-gray-500">Detalle de proyectos en este municipio</p>
                            </div>
                                <button onClick={() => setIsProyectosModalOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                            <div className="mb-6 grid grid-cols-3 gap-4">
                                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                    <div className="mb-1 text-sm text-blue-700">En formulación</div>
                                    <div className="text-2xl font-bold text-blue-800">
                                        {proyectosPorMunicipio[selectedMunicipio.nombre]?.filter((p) => p.estado === 'En formulación').length || 0}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                                    <div className="mb-1 text-sm text-green-700">En ejecución</div>
                                    <div className="text-2xl font-bold text-green-800">
                                        {proyectosPorMunicipio[selectedMunicipio.nombre]?.filter((p) => p.estado === 'En ejecución').length || 0}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
                                    <div className="mb-1 text-sm text-purple-700">Presupuesto total</div>
                                    <div className="text-2xl font-bold text-purple-800">
                                        $
                                        {proyectosPorMunicipio[selectedMunicipio.nombre]
                                            ?.reduce((sum, p) => sum + parseFloat(p.presupuesto.replace(/,/g, '')), 0)
                                            .toLocaleString() || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Lista de proyectos del municipio */}
                            <div className="overflow-hidden rounded-lg border">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                            >
                                            Nombre del Proyecto
                                        </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                            >
                                                Tipo
                                        </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                            >
                                            Presupuesto
                                        </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                            >
                                            Estado
                                        </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                            >
                                                Avance
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                                            >
                                                Acciones
                                        </th>
                                    </tr>
                                </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {proyectosPorMunicipio[selectedMunicipio.nombre]?.map((proyecto) => (
                                            <tr key={proyecto.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{proyecto.nombre}</div>
                                            </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{proyecto.tipo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">${proyecto.presupuesto}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                            proyecto.estado === 'En ejecución'
                                                                ? 'bg-green-100 text-green-800'
                                                                : proyecto.estado === 'En formulación'
                                                                  ? 'bg-blue-100 text-blue-800'
                                                                  : proyecto.estado === 'Aprobado'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                  : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                    {proyecto.estado}
                                                </span>
                                            </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {proyecto.avance > 0 ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-24 rounded-full bg-gray-200">
                                                                <div
                                                                    className="h-2 rounded-full bg-green-500"
                                                                    style={{ width: `${proyecto.avance}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-sm text-gray-600">{proyecto.avance}%</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                    <button className="mr-3 text-indigo-600 hover:text-indigo-900">Ver detalles</button>
                                                    <button className="text-gray-600 hover:text-gray-900">Editar</button>
                                            </td>
                                        </tr>
                                    ))}

                                        {!proyectosPorMunicipio[selectedMunicipio.nombre]?.length && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    No hay proyectos registrados para este municipio.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsProyectosModalOpen(false)}
                                    className="mr-3 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Cerrar
                                </button>
                                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700">
                                    Nuevo Proyecto en {selectedMunicipio.nombre}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal del Calendario */}
            {isCalendarModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Calendario de Eventos</h2>
                                    <p className="text-gray-500">Visualiza y gestiona todos los eventos programados</p>
                                </div>
                                <button onClick={() => setIsCalendarModalOpen(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Contenido del calendario con react-big-calendar */}
                            {!showEventForm ? (
                                <div className="mb-6 bg-white rounded-lg shadow-sm" style={{ height: '500px' }}>
                                    <Calendar
                                        localizer={localizer}
                                        events={calendarEvents}
                                        startAccessor="start"
                                        endAccessor="end"
                                        style={calendarStyles.calendar}
                                        onSelectEvent={handleEventSelect}
                                        eventPropGetter={eventPropGetter}
                                        dayPropGetter={dayPropGetter}
                                        defaultDate={new Date(2023, 8, 15)}
                                        views={['month', 'week', 'day', 'agenda']}
                                        messages={{
                                            next: "Siguiente",
                                            previous: "Anterior",
                                            today: "Hoy",
                                            month: "Mes",
                                            week: "Semana",
                                            day: "Día",
                                            agenda: "Agenda",
                                            date: "Fecha",
                                            time: "Hora",
                                            event: "Evento",
                                            noEventsInRange: "No hay eventos en este rango",
                                            showMore: total => `+ Ver ${total} más`
                                        }}
                                        components={{
                                            toolbar: CustomToolbar,
                                            event: CustomEvent
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Agregar Nuevo Evento</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Título del evento*</label>
                                            <input 
                                                type="text" 
                                                name="titulo" 
                                                value={newEvent.titulo}
                                                onChange={handleEventFormChange}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                                                placeholder="Ej: Reunión de planificación"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha*</label>
                                                <input 
                                                    type="date" 
                                                    name="fecha"
                                                    value={newEvent.fecha}
                                                    onChange={handleEventFormChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Hora*</label>
                                                <input 
                                                    type="time" 
                                                    name="hora"
                                                    value={newEvent.hora}
                                                    onChange={handleEventFormChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Municipio*</label>
                                            <select 
                                                name="municipio"
                                                value={newEvent.municipio}
                                                onChange={handleEventFormChange}
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">Seleccione un municipio</option>
                                                {municipiosFormulacion.map(mun => (
                                                    <option key={mun.id} value={mun.nombre}>{mun.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de evento</label>
                                                <select 
                                                    name="tipo"
                                                    value={newEvent.tipo}
                                                    onChange={handleEventFormChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="formulacion">Formulación</option>
                                                    <option value="presentacion">Presentación</option>
                                                    <option value="otro">Otro</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                                <select 
                                                    name="estado"
                                                    value={newEvent.estado}
                                                    onChange={handleEventFormChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="completado">Completado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button 
                                                onClick={() => setShowEventForm(false)}
                                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancelar
                                            </button>
                                            <button 
                                                onClick={handleAddEvent}
                                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                            >
                                                Guardar Evento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Filtros y controles */}
                            <div className="mb-4 flex justify-between">
                                <div className="flex gap-2">
                                    <div className="flex items-center gap-1">
                                        <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                                        <span className="text-sm text-gray-700">Formulación</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                        <span className="text-sm text-gray-700">Presentación</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                                        <span className="text-sm text-gray-700">Otros</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowEventForm(!showEventForm)} 
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                >
                                    {showEventForm ? "Cancelar" : "Agregar Evento"}
                                </button>
                            </div>

                            {/* Modal para detalles del evento si se ha seleccionado uno */}
                            {selectedEvent && (
                                <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                                    <div className="flex justify-between">
                                        <h3 className="text-lg font-bold text-gray-800">{selectedEvent.title}</h3>
                                        <button 
                                            onClick={() => setSelectedEvent(null)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Fecha:</span>{' '}
                                            {moment(selectedEvent.start).format('DD/MM/YYYY')}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Hora:</span>{' '}
                                            {moment(selectedEvent.start).format('HH:mm')}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Municipio:</span>{' '}
                                            {selectedEvent.municipio}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Estado:</span>{' '}
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium
                                                ${selectedEvent.estado === 'pendiente' ? 'bg-blue-100 text-blue-800' : 
                                                  selectedEvent.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                                                  'bg-red-100 text-red-800'}`}>
                                                {selectedEvent.estado}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                            Editar
                                        </button>
                                        <button className="rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsCalendarModalOpen(false)}
                                    className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Componentes personalizados para el calendario (añadir antes del export default)
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() - 1);
    toolbar.onNavigate('prev');
  };

  const goToNext = () => {
    toolbar.date.setMonth(toolbar.date.getMonth() + 1);
    toolbar.onNavigate('next');
  };

  const goToCurrent = () => {
    const now = new Date();
    toolbar.date.setMonth(now.getMonth());
    toolbar.date.setYear(now.getFullYear());
    toolbar.onNavigate('current');
  };

  const label = () => {
    const date = moment(toolbar.date);
    return (
      <span className="text-lg font-semibold text-gray-800">{date.format('MMMM YYYY')}</span>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goToBack}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goToCurrent}
          className="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-sm font-medium hover:bg-indigo-200"
        >
          Hoy
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="text-gray-800">{label()}</div>
      <div className="flex gap-2">
        {toolbar.views.map(view => (
          <button
            key={view}
            type="button"
            onClick={() => toolbar.onView(view)}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              toolbar.view === view
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {view === 'month' && 'Mes'}
            {view === 'week' && 'Semana'}
            {view === 'day' && 'Día'}
            {view === 'agenda' && 'Agenda'}
          </button>
        ))}
      </div>
    </div>
  );
};

const CustomEvent = ({ event }) => {
  let bgColor = '#6366F1'; // índigo por defecto
  
  if (event.tipo === 'presentacion') {
    bgColor = '#F59E0B'; // ámbar
  } else if (event.tipo === 'otro') {
    bgColor = '#8B5CF6'; // violeta
  }
  
  return (
    <div style={{ 
      backgroundColor: bgColor,
      color: '#ffffff',
      borderRadius: '4px',
      padding: '2px 5px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      opacity: event.estado === 'completado' ? 0.8 : 1
    }}>
      {event.title}
    </div>
  );
};

// Simplificar timeSlotWrapper para evitar errores
const SimpleTimeSlotWrapper = ({ children }) => children;
