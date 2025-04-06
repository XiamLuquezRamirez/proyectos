import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, ChevronLeft, Clock, Edit, FolderIcon, MapPin, Plus, Search, Settings, Shield, Trash2, UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import CardParametros from '../components/ui/cardParametros';
import TablaRegistros from '../components/ui/tablaRegistros';

export default function Parametros() {
    const { auth } = usePage().props;
    const [selectedCard, setSelectedCard] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState('informacion');

    // Datos de ejemplo para usuarios - Mover esto aquí para que esté disponible globalmente
    const usuariosData = [
        { id: 1, nombre: 'Ana Martinez', username: 'amartinez', rol: 'Administrador', email: 'ana.martinez@ejemplo.com' },
        { id: 2, nombre: 'Carlos Gomez', username: 'cgomez', rol: 'Coordinador', email: 'carlos.gomez@ejemplo.com' },
        { id: 3, nombre: 'Laura Torres', username: 'ltorres', rol: 'Analista', email: 'laura.torres@ejemplo.com' },
    ];

    // Estado para almacenar los usuarios cargados desde el servidor
    const [usuarios, setUsuarios] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const [presupuesto, setPresupuesto] = useState(0);
    const [newProject, setNewProject] = useState({
        nombre: '',
        descripcion: '',
        municipio: '',
        fechaInicio: '',
        fase: '',
        estado: '',
        presupuesto: '',
        responsable: '',
        categoria: '',
    });

    // Estado para controlar errores y carga
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Datos simulados específicos para cada categoría
    const proyectosData = [
        {
            id: 1,
            nombre: 'Proyecto de Infraestructura Vial',
            descripcion: 'Pavimentación de calles principales',
            municipio: 'Agua Chica',
            estado: 'Activo',
        },
        { id: 2, nombre: 'Centro Comunitario', descripcion: 'Construcción de centro comunitario', municipio: 'San Juan', estado: 'Activo' },
        { id: 3, nombre: 'Escuela Municipal', descripcion: 'Remodelación de escuela primaria', municipio: 'Villa Nueva', estado: 'Inactivo' },
    ];

    const estadosData = [
        { nombre: 'Formulación', descripcion: 'Proyecto en etapa de formulación' },
        { nombre: 'Viabilidad', descripcion: 'Proyecto en etapa de viabilidad' },
        { nombre: 'Licitación', descripcion: 'Proyecto en etapa de licitación' },
        { nombre: 'Ejecución', descripcion: 'Proyecto en etapa de ejecución' },
        { nombre: 'Liquidado', descripcion: 'Proyecto liquidado' },
        { nombre: 'Finalizado', descripcion: 'Proyecto finalizado' },
    ];

    const eventosData = [
        { id: 1, descripcion: 'Reunión de planificación', responsable: 'Ana Martinez', fecha: '2023-09-15', hora: '09:00', tipo: 'Formulación' },
        { id: 2, descripcion: 'Presentación de avances', responsable: 'Carlos Gomez', fecha: '2023-09-20', hora: '14:30', tipo: 'Presentación' },
        { id: 3, descripcion: 'Inspección técnica', responsable: 'Laura Torres', fecha: '2023-09-25', hora: '10:00', tipo: 'Otro' },
    ];

    // Agregar estados necesarios para contratos
    const [showContractsTab, setShowContractsTab] = useState(false);
    const [showContractModal, setShowContractModal] = useState(false);
    const [contractsData, setContractsData] = useState([
        {
            id: 1,
            numero: 'CTR-2023-001',
            tipo: 'Obra',
            contratista: 'Constructora ABC',
            valor: '$125,000,000',
            fechaFirma: '2023-05-15',
            duracion: '6 meses',
        },
        {
            id: 2,
            numero: 'CTR-2023-002',
            tipo: 'Consultoría',
            contratista: 'Ingeniería XYZ',
            valor: '$45,000,000',
            fechaFirma: '2023-06-20',
            duracion: '3 meses',
        },
    ]);
    const [newContract, setNewContract] = useState({
        numero: '',
        tipo: '',
        contratista: '',
        valor: '',
        fechaFirma: '',
        duracion: '',
        objeto: '',
    });

    // Estados para controlar la visibilidad y datos de anexos
    const [showAnnexesTab, setShowAnnexesTab] = useState(false);
    const [showAnnexModal, setShowAnnexModal] = useState(false);
    const [annexesData, setAnnexesData] = useState([
        {
            id: 1,
            nombre: 'Acta_Inicio.pdf',
            tipo: 'Acta',
            comentarios: 'Documento firmado por ambas partes',
            fechaCarga: '2023-08-10',
            tamaño: '1.5 MB',
        },
        {
            id: 2,
            nombre: 'Poliza_Cumplimiento.pdf',
            tipo: 'Póliza',
            comentarios: 'Póliza de garantía y cumplimiento',
            fechaCarga: '2023-08-12',
            tamaño: '850 KB',
        },
    ]);
    const [newAnnex, setNewAnnex] = useState({
        nombre: '',
        tipo: '',
        comentarios: '',
        fechaCarga: '',
        tamaño: '',
        archivo: null,
    });

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

    const formatCurrency = (value) => {
        const numericValue = value.replace(/\D/g, ""); // Solo números
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(numericValue / 100);
      };
    
      const handleChangePresupuesto = (e) => {
        setNewProject({ ...newProject, presupuesto: e.target.value});
        setPresupuesto(e.target.value)
    };

    // Función para manejar los cambios en el formulario de contrato
    const handleContractChange = (e) => {
        const { name, value } = e.target;
        setNewContract({
            ...newContract,
            [name]: value,
        });
    };

    // Función para agregar un nuevo contrato
    const handleAddContract = (e) => {
        e.preventDefault();

        // Validación básica
        if (!newContract.numero || !newContract.tipo || !newContract.contratista) {
            alert('Por favor complete los campos obligatorios del contrato');
            return;
        }

        // Crear nuevo contrato con ID único
        const nuevoContrato = {
            ...newContract,
            id: Date.now(), // Usar timestamp como ID temporal
        };

        // Actualizar la lista de contratos
        setContractsData([...contractsData, nuevoContrato]);

        // Cerrar el modal y resetear el formulario
        setShowContractModal(false);
        setNewContract({
            numero: '',
            tipo: '',
            contratista: '',
            valor: '',
            fechaFirma: '',
            duracion: '',
            objeto: '',
        });
    };

    // Función para guardar el proyecto y mostrar la pestaña de contratos
    const handleGuardarProyecto = () => {
        // Aquí iría la lógica para guardar el proyecto en el servidor
        console.log(newProject)
        axios
            .post('/parametros/guardarProyectos', newProject)
            .then((response) => {
                Swal.fire({
                    title: 'Proyecto guardado correctamente',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setShowContractsTab(true);
                setShowAnnexesTab(true);
                setActiveTab('anexos');
                cargarProyectos();
            })
            .catch((error) => {
                console.error('Error al guardar el proyecto:', error);
            });
    };

    // Función para manejar los cambios en el formulario de anexo
    const handleAnnexChange = (e) => {
        const { name, value } = e.target;
        setNewAnnex({
            ...newAnnex,
            [name]: value,
        });
    };

    // Función para manejar la selección de archivos
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tamaño máximo (10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('El archivo excede el tamaño máximo permitido (10MB)');
                return;
            }

            // Formatear el tamaño del archivo para mostrar
            const formattedSize =
                file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${Math.round((file.size / (1024 * 1024)) * 10) / 10} MB`;

            setNewAnnex({
                ...newAnnex,
                nombre: file.name,
                tamaño: formattedSize,
                fechaCarga: new Date().toISOString().split('T')[0],
                archivo: file,
            });
        }
    };

    // Función para agregar un nuevo anexo
    const handleAddAnnex = (e) => {
        e.preventDefault();

        // Validación básica
        if (!newAnnex.nombre || !newAnnex.tipo) {
            alert('Por favor seleccione un archivo y especifique el tipo de documento');
            return;
        }

        // Crear nuevo anexo con ID único
        const nuevoAnexo = {
            ...newAnnex,
            id: Date.now(), // Usar timestamp como ID temporal
        };

        // Actualizar la lista de anexos
        setAnnexesData([...annexesData, nuevoAnexo]);

        // Cerrar el modal y resetear el formulario
        setShowAnnexModal(false);
        setNewAnnex({
            nombre: '',
            tipo: '',
            comentarios: '',
            fechaCarga: '',
            tamaño: '',
            archivo: null,
        });
    };

    // Función para guardar el contrato y mostrar la pestaña de anexos
    const handleGuardarContrato = () => {
        // Aquí iría la lógica para guardar el contrato en el servidor
        alert('Contrato guardado correctamente');

        // Mostrar la pestaña de anexos después de guardar
        setShowAnnexesTab(true);

        // Cambiar a la pestaña de anexos
        setActiveTab('anexos');
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
                data = proyectos;
                title = 'Proyectos Registrados';
                columns = [
                    { key: 'nombre', label: 'Nombre del Proyecto' },
                    { key: 'descripcion', label: 'Descripción' },
                    { key: 'municipio', label: 'Municipio' },
                    { key: 'estado', label: 'Estado' },
                ];
                break;
            case 'usuarios':
                data = usuariosData;
                title = 'Usuarios del Sistema';
                columns = [
                    { key: 'nombre', label: 'Nombre Completo' },
                    { key: 'username', label: 'Usuario' },
                    { key: 'email', label: 'Correo Electrónico' },
                    { key: 'rol', label: 'Rol' },
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
                    { key: 'tipo', label: 'Tipo' },
                ];
                break;
            default:
                return null;
        }

        return (
            <TablaRegistros 
                title={title}
                data={data}
                columns={columns}
                onAddClick={() => setShowForm(true)}
                selectedCard={selectedCard}
            />
        );
    };

    // Renderizar el formulario específico según la categoría seleccionada
    const renderForm = () => {
        let title = '';

        switch (selectedCard) {
            case 'proyectos':
                title = 'Nuevo Proyecto';
                return (
                    <div className="mx-auto mt-8 w-full max-w-10xl">
                        <div className="rounded-lg bg-white shadow-md">
                            <div className="flex items-center justify-between border-b border-gray-200 p-6">
                                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                <button onClick={() => setShowForm(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Volver</span>
                                </button>
                            </div>

                            <div className="border-b border-gray-200">
                                <nav className="flex overflow-x-auto">
                                    <button
                                        onClick={() => setActiveTab('informacion')}
                                        className={`border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                            activeTab === 'informacion'
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <FolderIcon className="h-5 w-5" />
                                            <span>Información General</span>
                                        </div>
                                    </button>

                                    {showAnnexesTab && (
                                        <button
                                            onClick={() => setActiveTab('anexos')}
                                            className={`border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                                activeTab === 'anexos'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                                    />
                                                </svg>
                                                <span>Anexos y Documentos</span>
                                            </div>
                                        </button>
                                    )}

                                    {showContractsTab && (
                                        <button
                                            onClick={() => setActiveTab('contratos')}
                                            className={`border-b-2 px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                                activeTab === 'contratos'
                                                    ? 'border-indigo-500 text-indigo-600'
                                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <span>Contratos</span>
                                            </div>
                                        </button>
                                    )}
                                </nav>
                            </div>

                            <div className="p-6">
                                <form className="space-y-4">
                                    {activeTab === 'informacion' && (
                                        <>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Nombre del Proyecto*</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    placeholder="Ej: Construcción de Parque Municipal"
                                                    value={newProject.nombre}
                                                    onChange={(e) => setNewProject({ ...newProject, nombre: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Descripción*</label>
                                                <textarea
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    placeholder="Detalles del proyecto..."
                                                    rows={3}
                                                    value={newProject.descripcion}
                                                    onChange={(e) => setNewProject({ ...newProject, descripcion: e.target.value })}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Municipio*</label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <MapPin className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <select
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                            required
                                                            value={newProject.municipio}
                                                            onChange={(e) => setNewProject({ ...newProject, municipio: e.target.value })}
                                                        >
                                                            <option value="">Seleccione un municipio</option>
                                                            {municipios.map((municipio) => (
                                                                <option key={municipio.id} value={municipio.id}>
                                                                    {municipio.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                                    <input
                                                        type="date"
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        value={newProject.fechaInicio}
                                                        onChange={(e) => setNewProject({ ...newProject, fechaInicio: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Fase del Proyecto</label>
                                                    <div className="flex items-center space-x-4">
                                                        <select
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                            value={newProject.fase}
                                                            onChange={(e) => setNewProject({ ...newProject, fase: e.target.value })}
                                                        >
                                                            <option value="">Seleccione un estado</option>

                                                            {estadosData.map((estado) => (
                                                                <option key={estado.id} value={estado.nombre}>
                                                                    {estado.nombre}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Estado Proyecto</label>
                                                    <div className="flex items-center space-x-4">
                                                        <select
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                            value={newProject.estado}
                                                            onChange={(e) => setNewProject({ ...newProject, estado: e.target.value })}
                                                        >
                                                            <option value="">Seleccione un estado</option>
                                                            <option value="Activo">Activo</option>
                                                            <option value="Inactivo">Inactivo</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Presupuesto Estimado</label>
                                                    <div className="relative mt-1 rounded-md shadow-sm">
                                                        
                                                        <input
                                                            type="text"
                                                            className="w-full rounded-md border border-gray-300 py-2 pr-12 pl-7 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                            required
                                                            onChange={handleChangePresupuesto}
                                                            placeholder="$ 0.00"
                                                            value={newProject.presupuesto}
                                                            
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Responsable</label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <select
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                            disabled={loading}
                                                            value={newProject.responsable}
                                                            onChange={(e) => setNewProject({ ...newProject, responsable: e.target.value })}
                                                        >
                                                            <option value="">Seleccione un responsable</option>
                                                            {loading ? (
                                                                <option value="" disabled>
                                                                    Cargando usuarios...
                                                                </option>
                                                            ) : error ? (
                                                                <option value="" disabled>
                                                                    Error al cargar usuarios
                                                                </option>
                                                            ) : (
                                                                usuarios.map((usuario) => (
                                                                    <option key={usuario.id} value={usuario.id}>
                                                                        {usuario.nombre}
                                                                    </option>
                                                                ))
                                                            )}
                                                        </select>
                                                        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                                                        {loading && (
                                                            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                                                <svg
                                                                    className="h-5 w-5 animate-spin text-indigo-500"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                    ></path>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Categoría del Proyecto</label>
                                                <select
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    value={newProject.categoria}
                                                    onChange={(e) => setNewProject({ ...newProject, categoria: e.target.value })}
                                                >
                                                    <option value="">Seleccione una categoría</option>
                                                    <option value="Infraestructura">Infraestructura</option>
                                                    <option value="Educación">Educación</option>
                                                    <option value="Salud">Salud</option>
                                                    <option value="Desarrollo Social">Desarrollo Social</option>
                                                    <option value="Medio Ambiente">Medio Ambiente</option>
                                                </select>
                                            </div>

                                            {/* Botones de acción para la pestaña información */}
                                            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowForm(false)}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleGuardarProyecto}
                                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                                >
                                                    Guardar Proyecto
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'anexos' && (
                                        <div className="space-y-6">
                                            {/* Mensaje de éxito al guardar proyecto */}
                                            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <svg
                                                            className="h-5 w-5 text-green-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-green-800">Proyecto guardado correctamente</h3>
                                                        <div className="mt-2 text-sm text-green-700">
                                                            <p>
                                                                La información general del proyecto ha sido guardada. Ahora puede gestionar los
                                                                documentos anexos del proyecto.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Header con título y botón para añadir anexo */}
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-800">Anexos del Proyecto</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAnnexModal(true)}
                                                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span>Añadir Documento</span>
                                                </button>
                                            </div>

                                            {/* Tabla de anexos */}
                                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Nombre
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
                                                                Comentarios
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Fecha
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Tamaño
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
                                                        {annexesData.length > 0 ? (
                                                            annexesData.map((annex) => (
                                                                <tr key={annex.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                                        {annex.nombre}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {annex.tipo}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {annex.comentarios}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {annex.fechaCarga}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {annex.tamaño}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                                        <button className="mr-3 text-indigo-600 hover:text-indigo-900">
                                                                            <Edit className="h-5 w-5" />
                                                                        </button>
                                                                        <button className="text-red-600 hover:text-red-900">
                                                                            <Trash2 className="h-5 w-5" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                                                    No hay documentos anexos para este proyecto. Haga clic en "Añadir Documento" para
                                                                    agregar uno.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Botones de acciones */}
                                            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('informacion')}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Volver a Información
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('contratos')}
                                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                                >
                                                    Continuar a Contratos
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'contratos' && (
                                        <div className="space-y-6">
                                            {/* Mensaje de éxito al guardar proyecto */}
                                            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <svg
                                                            className="h-5 w-5 text-green-400"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-sm font-medium text-green-800">Proyecto guardado correctamente</h3>
                                                        <div className="mt-2 text-sm text-green-700">
                                                            <p>
                                                                La información general del proyecto ha sido guardada. Ahora puede gestionar los
                                                                contratos asociados a este proyecto.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Header con título y botón para añadir contrato */}
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-800">Contratos Asociados</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowContractModal(true)}
                                                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span>Añadir Contrato</span>
                                                </button>
                                            </div>

                                            {/* Tabla de contratos */}
                                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                N° Contrato
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
                                                                Contratista
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Valor
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Fecha Firma
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                            >
                                                                Duración
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
                                                        {contractsData.length > 0 ? (
                                                            contractsData.map((contract) => (
                                                                <tr key={contract.id} className="hover:bg-gray-50">
                                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                                                                        {contract.numero}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {contract.tipo}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {contract.contratista}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {contract.valor}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {contract.fechaFirma}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                                        {contract.duracion}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                                        <button className="mr-3 text-indigo-600 hover:text-indigo-900">
                                                                            <Edit className="h-5 w-5" />
                                                                        </button>
                                                                        <button className="text-red-600 hover:text-red-900">
                                                                            <Trash2 className="h-5 w-5" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                                    No hay contratos asociados a este proyecto. Haga clic en "Añadir Contrato" para
                                                                    crear uno.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Botones de acciones */}
                                            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('informacion')}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Volver
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Modal para añadir contrato */}
                            {showContractModal && (
                                <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-600">
                                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                                            <h3 className="text-xl font-bold text-gray-800">Nuevo Contrato</h3>
                                            <button
                                                onClick={() => setShowContractModal(false)}
                                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <form onSubmit={handleAddContract} className="space-y-4 p-6">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Número de Contrato*</label>
                                                    <input
                                                        type="text"
                                                        name="numero"
                                                        value={newContract.numero}
                                                        onChange={handleContractChange}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        placeholder="Ej: CTR-2023-001"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Contrato*</label>
                                                    <select
                                                        name="tipo"
                                                        value={newContract.tipo}
                                                        onChange={handleContractChange}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        required
                                                    >
                                                        <option value="">Seleccione un tipo</option>
                                                        <option value="Obra">Contrato de Obra</option>
                                                        <option value="Consultoría">Consultoría</option>
                                                        <option value="Servicios">Prestación de Servicios</option>
                                                        <option value="Suministro">Suministro</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Contratista*</label>
                                                <input
                                                    type="text"
                                                    name="contratista"
                                                    value={newContract.contratista}
                                                    onChange={handleContractChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    placeholder="Nombre o razón social del contratista"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Valor del Contrato</label>
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <span className="text-gray-500 sm:text-sm">$</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="valor"
                                                            value={newContract.valor}
                                                            onChange={handleContractChange}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 pl-7 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de Firma</label>
                                                    <input
                                                        type="date"
                                                        name="fechaFirma"
                                                        value={newContract.fechaFirma}
                                                        onChange={handleContractChange}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Duración</label>
                                                <input
                                                    type="text"
                                                    name="duracion"
                                                    value={newContract.duracion}
                                                    onChange={handleContractChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    placeholder="Ej: 6 meses"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Objeto del Contrato</label>
                                                <textarea
                                                    name="objeto"
                                                    value={newContract.objeto}
                                                    onChange={handleContractChange}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                    placeholder="Descripción del objeto del contrato"
                                                    rows={3}
                                                ></textarea>
                                            </div>

                                            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowContractModal(false)}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                                    Guardar Contrato
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Modal para añadir anexo */}
                            {showAnnexModal && (
                                <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-600">
                                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
                                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                                            <h3 className="text-xl font-bold text-gray-800">Nuevo Anexo</h3>
                                            <button
                                                onClick={() => setShowAnnexModal(false)}
                                                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <form onSubmit={handleAddAnnex} className="space-y-4 p-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Archivo*</label>
                                                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
                                                        <input type="file" id="annex-file" onChange={handleFileChange} className="hidden" />
                                                        <label
                                                            htmlFor="annex-file"
                                                            className="flex cursor-pointer flex-col items-center justify-center"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-10 w-10 text-gray-400"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                />
                                                            </svg>
                                                            <span className="mt-2 text-sm text-gray-600">
                                                                Haga clic para seleccionar un archivo o arrástrelo aquí
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Documento*</label>
                                                    <select
                                                        name="tipo"
                                                        value={newAnnex.tipo}
                                                        onChange={handleAnnexChange}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        required
                                                    >
                                                        <option value="">Seleccione un tipo</option>
                                                        <option value="Acta">Acta</option>
                                                        <option value="Garantía">Garantía</option>
                                                        <option value="Póliza">Póliza</option>
                                                        <option value="Certificado">Certificado</option>
                                                        <option value="Otro">Otro</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">Comentarios</label>
                                                    <textarea
                                                        name="comentarios"
                                                        value={newAnnex.comentarios}
                                                        onChange={handleAnnexChange}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                        placeholder="Descripción o información adicional del documento"
                                                        rows={3}
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAnnexModal(false)}
                                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                                    Guardar Anexo
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'usuarios':
                title = 'Nuevo Usuario';
                return (
                    <div className="mx-auto mt-8 w-full max-w-2xl">
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                <button onClick={() => setShowForm(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Volver</span>
                                </button>
                            </div>
                            <form className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre Completo</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                placeholder="Ej: jperez"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Ej: juan.perez@ejemplo.com"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
                                        <input
                                            type="password"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            placeholder="********"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            placeholder="********"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Rol</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <Shield className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
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
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
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
                    <div className="mx-auto mt-8 w-full max-w-2xl">
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                                <button onClick={() => setShowForm(false)} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                                    <ChevronLeft className="h-5 w-5" />
                                    <span className="sr-only">Volver</span>
                                </button>
                            </div>
                            <form className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Descripción del Evento</label>
                                    <textarea
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Ej: Reunión de seguimiento de proyecto"
                                        rows={2}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Responsable</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <UserIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                            <option value="">Seleccione un responsable</option>
                                            <option value="Ana Martinez">Ana Martinez</option>
                                            <option value="Carlos Gomez">Carlos Gomez</option>
                                            <option value="Laura Torres">Laura Torres</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Hora</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="time"
                                                className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Evento</label>
                                    <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                        <option value="">Seleccione un tipo</option>
                                        <option value="Formulación">Formulación</option>
                                        <option value="Presentación">Presentación</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Municipio Relacionado</label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
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
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
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
                    <Link href={route('dashboard')} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
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
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {/* Tarjeta de Proyectos */}

                                    <CardParametros 
                                    title="Proyectos" 
                                    description="Gestione los proyectos con información detallada, municipios y estados correspondientes." 
                                    count={proyectosData.length}
                                    color="blue"
                                    icon={FolderIcon}
                                    onClick={() => setSelectedCard('proyectos')}
                                    />

                                    {/* Tarjeta de Eventos */}

                                    <CardParametros 
                                    title="Eventos" 
                                    description="Gestione eventos con responsables, fechas y municipios relacionados." 
                                    count={eventosData.length}
                                    color="amber"
                                    icon={Calendar}
                                    onClick={() => setSelectedCard('eventos')}
                                    />
                                  

                                    {/* Tarjeta de Usuarios */}
                                     
                                    <CardParametros  
                                    title="Usuarios" 
                                    description="Administre usuarios del sistema, nombres, roles y credenciales de acceso." 
                                    count={usuarios.length}
                                    color="purple"
                                    icon={UserIcon}
                                    onClick={() => setSelectedCard('usuarios')}
                                    />
                                    
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
                                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
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
