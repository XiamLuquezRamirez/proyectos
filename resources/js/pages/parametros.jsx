import React, { useState, useEffect } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { BarChart2, UserIcon, Calendar, FolderIcon, Settings, ChevronLeft, Plus, Edit, Trash2, Search, MapPin, Clock, Shield } from 'lucide-react';

export default function Parametros() {
    const { auth } = usePage().props;
    const [selectedCard, setSelectedCard] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('informacion');
    
    // Datos de ejemplo para usuarios - Mover esto aquí para que esté disponible globalmente
    const usuariosEjemplo = [
        { id: 1, nombre: 'Ana Martinez', username: 'amartinez', rol: 'Administrador', email: 'ana.martinez@ejemplo.com' },
        { id: 2, nombre: 'Carlos Gomez', username: 'cgomez', rol: 'Coordinador', email: 'carlos.gomez@ejemplo.com' },
        { id: 3, nombre: 'Laura Torres', username: 'ltorres', rol: 'Analista', email: 'laura.torres@ejemplo.com' },
    ];
    
    // Estado para almacenar los usuarios cargados desde el servidor
    const [usuarios, setUsuarios] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [presupuesto, setPresupuesto] = useState(0);
    // Estado para controlar errores y carga
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Datos simulados específicos para cada categoría
    const proyectosData = [
        { id: 1, nombre: 'Proyecto de Infraestructura Vial', descripcion: 'Pavimentación de calles principales', municipio: 'Agua Chica', estado: 'Activo' },
        { id: 2, nombre: 'Centro Comunitario', descripcion: 'Construcción de centro comunitario', municipio: 'San Juan', estado: 'Activo' },
        { id: 3, nombre: 'Escuela Municipal', descripcion: 'Remodelación de escuela primaria', municipio: 'Villa Nueva', estado: 'Inactivo' },
    ];

    const estadosData = [
        { id: 1, nombre: 'Formulación', descripcion: 'Proyecto en etapa de formulación' },
        { id: 2, nombre: 'Viabilidad', descripcion: 'Proyecto en etapa de viabilidad' },
        { id: 3, nombre: 'Licitación', descripcion: 'Proyecto en etapa de licitación' },
        { id: 4, nombre: 'Ejecución', descripcion: 'Proyecto en etapa de ejecución' },
        { id: 5, nombre: 'Liquidado', descripcion: 'Proyecto liquidado' },
        { id: 6, nombre: 'Finalizado', descripcion: 'Proyecto finalizado' },
    ];

    const eventosData = [
        { id: 1, descripcion: 'Reunión de planificación', responsable: 'Ana Martinez', fecha: '2023-09-15', hora: '09:00', tipo: 'Formulación' },
        { id: 2, descripcion: 'Presentación de avances', responsable: 'Carlos Gomez', fecha: '2023-09-20', hora: '14:30', tipo: 'Presentación' },
        { id: 3, descripcion: 'Inspección técnica', responsable: 'Laura Torres', fecha: '2023-09-25', hora: '10:00', tipo: 'Otro' },
    ];

    // Función para cargar usuarios desde el servidor
    const cargarUsuarios = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Realizar la petición GET al endpoint de usuarios
            const response = await axios.post('/parametros/usuarios');
            
            // Si la petición es exitosa, actualizar el estado
            setUsuarios(response.data);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('No se pudieron cargar los usuarios. Intente nuevamente más tarde.');
            
            // Usar los datos de ejemplo definidos arriba
            setUsuarios(usuariosEjemplo);
        } finally {
            setLoading(false);
        }
    };

    //fucntion para cargar los municipios
    const cargarMunicipios = async () => {
        setLoading(true);
        setError(null);        
        try {
            const response = await axios.post('/parametros/municipios');
            setMunicipios(response.data);
        } catch (err) {
            console.error('Error al cargar municipios:', err);
            setError('No se pudieron cargar los municipios. Intente nuevamente más tarde.');
            setMunicipios(municipiosData);
        } finally {
            setLoading(false);
        }
    };

    const cargarProyectos = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/parametros/proyectos');
            setProyectos(response.data);
        } catch (err) {
            console.error('Error al cargar proyectos:', err);
            setError('No se pudieron cargar los proyectos. Intente nuevamente más tarde.');
            setProyectos(proyectosData);
        } finally {
            setLoading(false);
        }   
    };

    const formatMoneda = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handlePresupuestoChange = (e) => {
        setPresupuesto(formatMoneda(e.target.value));
    };


    // Efecto para cargar usuarios cuando se selecciona la tarjeta de proyectos
    // o cuando se abre el formulario
    useEffect(() => {
        if (selectedCard === 'proyectos' && showForm) {
            cargarUsuarios();
        }
    }, [selectedCard, showForm]);

    useEffect(() => {
        if (selectedCard === 'proyectos') {
            cargarProyectos();
        }
    }, [selectedCard]);

    useEffect(() => {
        if (selectedCard === 'proyectos' && showForm) {
            cargarMunicipios();
        }
    }, [selectedCard, showForm]);



    // Renderizar el listado específico según la categoría seleccionada
    const renderListado = () => {
        let data = [];
        let title = '';
        let columns = [];

        switch (selectedCard) {
            case 'proyectos':
                data = proyectosData;
                title = 'Proyectos Registrados';
                columns = [
                    { key: 'nombre', label: 'Nombre del Proyecto' },
                    { key: 'descripcion', label: 'Descripción' },
                    { key: 'municipio', label: 'Municipio' },
                    { key: 'estado', label: 'Estado' }
                ];
                break;
            case 'usuarios':
                data = usuariosData;
                title = 'Usuarios del Sistema';
                columns = [
                    { key: 'nombre', label: 'Nombre Completo' },
                    { key: 'username', label: 'Usuario' },
                    { key: 'email', label: 'Correo Electrónico' },
                    { key: 'rol', label: 'Rol' }
                ];
                break;
            case 'eventos':
                data = eventosData;
                title = 'Eventos Programados';
                columns = [
                    { key: 'descripcion', label: 'Descripción' },
                    { key: 'responsable', label: 'Responsable' },
                    { key: 'fecha', label: 'Fecha' },
                    { key: 'hora', label: 'Hora' },
                    { key: 'tipo', label: 'Tipo' }
                ];
                break;
            default:
                return null;
        }

        return (
            <div className="w-full max-w-6xl mx-auto mt-8">
                <div className="bg-white rounded-lg shadow-md">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                            <button 
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Nuevo {selectedCard === 'proyectos' ? 'Proyecto' : 
                                            selectedCard === 'usuarios' ? 'Usuario' : 'Evento'}</span>
                            </button>
                        </div>
                        <div className="mt-4 flex items-center border rounded-lg overflow-hidden">
                            <Search className="h-5 w-5 text-gray-400 ml-3" />
                            <input
                                type="text"
                                placeholder={`Buscar ${title.toLowerCase()}...`}
                                className="w-full px-3 py-2 focus:outline-none text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column) => (
                                        <th 
                                            key={column.key}
                                            scope="col" 
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {column.label}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                                {column.key === 'estado' ? (
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                        item[column.key] === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item[column.key]}
                                                    </span>
                                                ) : column.key === 'rol' ? (
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                        item[column.key] === 'Administrador' ? 'bg-purple-100 text-purple-800' : 
                                                        item[column.key] === 'Coordinador' ? 'bg-blue-100 text-blue-800' : 
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {item[column.key]}
                                                    </span>
                                                ) : column.key === 'tipo' ? (
                                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                        item[column.key] === 'Formulación' ? 'bg-indigo-100 text-indigo-800' : 
                                                        item[column.key] === 'Presentación' ? 'bg-amber-100 text-amber-800' : 
                                                        'bg-violet-100 text-violet-800'
                                                    }`}>
                                                        {item[column.key]}
                                                    </span>
                                                ) : (
                                                    <div className="text-gray-900">{item[column.key]}</div>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            Mostrando {data.length} de {data.length} registros
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
                                Anterior
                            </button>
                            <button className="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-50">
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Renderizar el formulario específico según la categoría seleccionada
    const renderForm = () => {
        let title = '';
        
        switch (selectedCard) {
            case 'proyectos':
                title = 'Nuevo Proyecto';
                return (
                    <div className="w-full max-w-2xl mx-auto mt-8">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                <button 
                                    onClick={() => setShowForm(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Volver</span>
                                </button>
                            </div>
                            
                            <div className="border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    <button
                                        onClick={() => setActiveTab('informacion')}
                                        className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                            activeTab === 'informacion'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FolderIcon className="h-5 w-5" />
                                            <span>Información General</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('anexos')}
                                        className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                            activeTab === 'anexos'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                            </svg>
                                            <span>Anexos y Documentos</span>
                                        </div>
                                    </button>
                                </nav>
                            </div>
                            
                            <div className="p-6">
                                <form className="space-y-4">
                                    {activeTab === 'informacion' && (
                                        <>
                                            <div>
                                             
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre del Proyecto*
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Ej: Construcción de Parque Municipal"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción*
                                                </label>
                                                <textarea
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    placeholder="Detalles del proyecto..."
                                                    rows={3}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Municipio*
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <MapPin className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <select 
                                                            className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            required
                                                        >
                                                            <option value="">Seleccione un municipio</option>
                                                            {municipios.map((municipio) => (
                                                                <option key={municipio.id} value={municipio.id}>{municipio.nombre}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Fecha de Inicio
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fase del Proyecto
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                
                                                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                        <option value="">Seleccione un estado</option>
                                                       
                                                        {estadosData.map((estado) => (
                                                            <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Estado Proyecto
                                                </label>
                                                <div className="flex items-center space-x-4">
                                                
                                                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                        <option value="">Seleccione un estado</option>
                                                        <option value="Activo">Activo</option>
                                                        <option value="Inactivo">Inactivo</option>
                                                      
                                                    </select>
                                                </div>
                                            </div>            
                                            </div>    
                                           
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Presupuesto Estimado
                                                    </label>
                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-md border border-gray-300 pl-7 pr-12 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            required
                                                            onChange={handlePresupuestoChange}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Responsable
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <select 
                                                            className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            disabled={loading}
                                                        >
                                                            <option value="">Seleccione un responsable</option>
                                                            {loading ? (
                                                                <option value="" disabled>Cargando usuarios...</option>
                                                            ) : error ? (
                                                                <option value="" disabled>Error al cargar usuarios</option>
                                                            ) : (
                                                                usuarios.map(usuario => (
                                                                    <option key={usuario.id} value={usuario.id}>
                                                                        {usuario.nombre}
                                                                    </option>
                                                                ))
                                                            )}
                                                        </select>
                                                        {error && (
                                                            <p className="mt-1 text-xs text-red-600">{error}</p>
                                                        )}
                                                        {loading && (
                                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Categoría del Proyecto
                                                </label>
                                                <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                    <option value="">Seleccione una categoría</option>
                                                    <option value="Infraestructura">Infraestructura</option>
                                                    <option value="Educación">Educación</option>
                                                    <option value="Salud">Salud</option>
                                                    <option value="Desarrollo Social">Desarrollo Social</option>
                                                    <option value="Medio Ambiente">Medio Ambiente</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                    
                                    {activeTab === 'anexos' && (
                                        <div className="space-y-6">
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                <div className="mx-auto h-12 w-12 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <div className="mt-2 flex text-sm text-gray-600 justify-center">
                                                    <label 
                                                        htmlFor="file-upload" 
                                                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                    >
                                                        <span>Subir archivos</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                                    </label>
                                                    <p className="pl-1">o arrastre y suelte aquí</p>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PDF, Word, Excel o imágenes (máximo 10MB por archivo)
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-3">Archivos seleccionados:</h4>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center justify-between bg-white rounded-md p-2 shadow-sm">
                                                        <div className="flex items-center">
                                                            <div className="p-1.5 bg-red-100 rounded mr-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="font-medium text-gray-900">Planos_Proyecto.pdf</p>
                                                                <p className="text-gray-500 text-xs">1.2 MB - PDF</p>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="text-gray-400 hover:text-red-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                    <li className="flex items-center justify-between bg-white rounded-md p-2 shadow-sm">
                                                        <div className="flex items-center">
                                                            <div className="p-1.5 bg-green-100 rounded mr-2">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="text-sm">
                                                                <p className="font-medium text-gray-900">Presupuesto_Detallado.xlsx</p>
                                                                <p className="text-gray-500 text-xs">524 KB - Excel</p>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="text-gray-400 hover:text-red-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </li>
                                                </ul>
                                                <div className="mt-2 flex justify-between text-sm">
                                                    <span className="text-gray-500">2 archivos seleccionados</span>
                                                    <button 
                                                        type="button"
                                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                                    >
                                                        Eliminar todos
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div className="rounded-lg border border-gray-200 p-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-3">Clasificación de documentos</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Tipo de documento
                                                        </label>
                                                        <select className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                            <option value="">Seleccionar tipo</option>
                                                            <option value="planos">Planos</option>
                                                            <option value="presupuesto">Presupuesto</option>
                                                            <option value="contrato">Contrato</option>
                                                            <option value="informe">Informe técnico</option>
                                                            <option value="otro">Otro</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                                            Etapa del proyecto
                                                        </label>
                                                        <select className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                                            <option value="">Seleccionar etapa</option>
                                                            <option value="planificacion">Planificación</option>
                                                            <option value="ejecucion">Ejecución</option>
                                                            <option value="seguimiento">Seguimiento</option>
                                                            <option value="cierre">Cierre</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        Comentarios sobre el documento
                                                    </label>
                                                    <textarea
                                                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Añada comentarios sobre este documento..."
                                                        rows={2}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                        {activeTab === 'informacion' ? (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('anexos')}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            >
                                                Continuar a Anexos
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                            >
                                                Guardar Proyecto
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
                
            case 'usuarios':
                title = 'Nuevo Usuario';
                return (
                    <div className="w-full max-w-2xl mx-auto mt-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                <button 
                                    onClick={() => setShowForm(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Volver</span>
                                </button>
                            </div>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre Completo
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre de Usuario
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Ej: jperez"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej: juan.perez@ejemplo.com"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="********"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="********"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rol
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="">Seleccione un rol</option>
                                            <option value="Administrador">Administrador</option>
                                            <option value="Coordinador">Coordinador</option>
                                            <option value="Analista">Analista</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Crear Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
                
            case 'eventos':
                title = 'Nuevo Evento';
                return (
                    <div className="w-full max-w-2xl mx-auto mt-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                <button 
                                    onClick={() => setShowForm(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Volver</span>
                                </button>
                            </div>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción del Evento
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Ej: Reunión de seguimiento de proyecto"
                                        rows={2}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Responsable
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="">Seleccione un responsable</option>
                                            <option value="Ana Martinez">Ana Martinez</option>
                                            <option value="Carlos Gomez">Carlos Gomez</option>
                                            <option value="Laura Torres">Laura Torres</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hora
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="time"
                                                className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tipo de Evento
                                    </label>
                                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="">Seleccione un tipo</option>
                                        <option value="Formulación">Formulación</option>
                                        <option value="Presentación">Presentación</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Municipio Relacionado
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full rounded-md border border-gray-300 pl-10 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="">Seleccione un municipio</option>
                                            <option value="Agua Chica">Agua Chica</option>
                                            <option value="San Juan">San Juan</option>
                                            <option value="Villa Nueva">Villa Nueva</option>
                                            <option value="Santa Elena">Santa Elena</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                    >
                                        Programar Evento
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Parámetros - Gestión de Proyectos" />
            
            <div className="min-h-screen bg-gray-100 pb-12">
                {/* Barra superior */}
                <div className="flex items-center justify-between bg-white p-6 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Configuración de Parámetros</h1>
                        <p className="text-sm text-gray-500">Gestione los parámetros del sistema de proyectos</p>
                    </div>
                    <Link 
                        href={route('dashboard')} 
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        <span>Volver al Dashboard</span>
                    </Link>
                </div>

                {/* Contenido principal */}
                <div className="container mx-auto px-6 py-8">
                    {/* Mostrar tarjetas solo si no hay una seleccionada o si hay selección pero no se está mostrando el formulario */}
                    {(!selectedCard || (selectedCard && !showForm)) && (
                        <>
                            {/* Título de sección */}
                            {!selectedCard && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800">Categorías de Configuración</h2>
                                    <p className="text-gray-500">Seleccione una categoría para configurar sus parámetros</p>
                                </div>
                            )}

                            {/* Tarjetas de configuración */}
                            {!selectedCard && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Tarjeta de Proyectos */}
                                    <div 
                                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                                        onClick={() => setSelectedCard('proyectos')}
                                    >
                                        <div className="p-1 bg-blue-500"></div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-blue-100 rounded-full">
                                                    <FolderIcon className="h-7 w-7 text-blue-600" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800">Proyectos</h3>
                                            </div>
                                            <p className="text-gray-500 mb-4">Gestione los proyectos con información detallada, municipios y estados correspondientes.</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-blue-600">{proyectosData.length} proyectos registrados</span>
                                                <div className="p-2 rounded-full bg-blue-50">
                                                    <Settings className="h-5 w-5 text-blue-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tarjeta de Eventos */}
                                    <div 
                                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                                        onClick={() => setSelectedCard('eventos')}
                                    >
                                        <div className="p-1 bg-amber-500"></div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-amber-100 rounded-full">
                                                    <Calendar className="h-7 w-7 text-amber-600" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800">Eventos</h3>
                                            </div>
                                            <p className="text-gray-500 mb-4">Gestione eventos con responsables, fechas y municipios relacionados.</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-amber-600">{eventosData.length} eventos programados</span>
                                                <div className="p-2 rounded-full bg-amber-50">
                                                    <Settings className="h-5 w-5 text-amber-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                     {/* Tarjeta de Usuarios */}
                                     <div 
                                        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                                        onClick={() => setSelectedCard('usuarios')}
                                    >
                                        <div className="p-1 bg-purple-500"></div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-purple-100 rounded-full">
                                                    <UserIcon className="h-7 w-7 text-purple-600" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-800">Usuarios</h3>
                                            </div>
                                            <p className="text-gray-500 mb-4">Administre usuarios del sistema, nombres, roles y credenciales de acceso.</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-purple-600">{usuarios.length} usuarios activos</span>
                                                <div className="p-2 rounded-full bg-purple-50">
                                                    <Settings className="h-5 w-5 text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Mostrar listado si hay una tarjeta seleccionada y no se está mostrando el formulario */}
                    {selectedCard && !showForm && renderListado()}

                    {/* Mostrar formulario si así se ha indicado */}
                    {selectedCard && showForm && renderForm()}

                    {/* Botón para volver a la selección de tarjetas cuando hay una tarjeta seleccionada */}
                    {selectedCard && !showForm && (
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Volver a categorías
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 