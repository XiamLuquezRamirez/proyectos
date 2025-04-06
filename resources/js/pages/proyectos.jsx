import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ChevronLeft, Edit, Trash2, FolderIcon, MapPin, UserIcon } from 'lucide-react';
import TablaRegistros from '../components/ui/tablaRegistros';
import FormularioProyecto from '../components/proyectos/FormularioProyecto';

const Proyectos = () => {
    // Estado para controlar la vista actual (lista o formulario)
    const [showForm, setShowForm] = useState(false);
    
    // Estados para proyectos y filtrado
    const [proyectos, setProyectos] = useState([]);
    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados para datos relacionados
    const [usuarios, setUsuarios] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estados para las pestañas de contratos y anexos
    const [showContractsTab, setShowContractsTab] = useState(false);
    const [showAnnexesTab, setShowAnnexesTab] = useState(false);
    const [activeTab, setActiveTab] = useState('informacion');
    
    // Estados para los contratos
    const [contractsData, setContractsData] = useState([]);
    const [showContractModal, setShowContractModal] = useState(false);
    const [newContract, setNewContract] = useState({
        numero: '',
        tipo: '',
        contratista: '',
        valor: '',
        fechaFirma: '',
        duracion: '',
        objeto: ''
    });
    
    // Estados para los anexos
    const [annexesData, setAnnexesData] = useState([]);
    const [showAnnexModal, setShowAnnexModal] = useState(false);
    const [newAnnex, setNewAnnex] = useState({
        nombre: '',
        tipo: '',
        comentarios: '',
        archivo: null,
        fechaCarga: '',
        tamaño: ''
    });
    
    // Estado para los estados del proyecto (fases)
    const [estadosData, setEstadosData] = useState([
        { id: 1, nombre: 'Planificación' },
        { id: 2, nombre: 'Ejecución' },
        { id: 3, nombre: 'Finalizado' },
        { id: 4, nombre: 'Suspendido' }
    ]);

    // Estado para controlar si estamos editando o creando un nuevo proyecto
    const [editMode, setEditMode] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(null);
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

    // Función para cargar los proyectos desde la API
    const cargarProyectos = async () => {
        try {
            const response = await axios.get('/parametros/cargarProyectos');
            setProyectos(response.data);
            setFilteredProyectos(response.data);
        } catch (error) {
            console.error('Error al cargar proyectos:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los proyectos',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    // Función para cargar los usuarios desde la API
    const cargarUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/parametros/getUsuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setError('Error al cargar la lista de usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar los municipios desde la API
    const cargarMunicipios = async () => {
        try {
            const response = await axios.get('/parametros/getMunicipios');
            setMunicipios(response.data);
        } catch (error) {
            console.error('Error al cargar municipios:', error);
        }
    };

    // Función mejorada para formatear valores monetarios para visualización 
    const formatMoneda = (value) => {
        if (!value && value !== 0) return '';
        
        // Asegurarse de que value sea un número
        const numericValue = typeof value === 'string' ? 
            parseInt(value.replace(/[^\d]/g, '')) : 
            parseInt(value);
        
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numericValue);
    };

    // Manejador para cambios en los contratos
    const handleContractChange = (e) => {
        const { name, value } = e.target;
        setNewContract({ ...newContract, [name]: value });
    };

    // Manejador para guardar un contrato
    const handleAddContract = (e) => {
        e.preventDefault();
        // Validación básica
        if (!newContract.numero || !newContract.tipo || !newContract.contratista) {
            Swal.fire({
                title: 'Campos requeridos',
                text: 'Por favor complete los campos obligatorios',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Generar un ID único para el nuevo contrato
        const id = Date.now();
        const newContractWithId = { ...newContract, id };

        // Agregar el contrato al arreglo de contratos
        setContractsData([...contractsData, newContractWithId]);

        // Cerrar el modal y resetear el formulario
        setShowContractModal(false);
        setNewContract({
            numero: '',
            tipo: '',
            contratista: '',
            valor: '',
            fechaFirma: '',
            duracion: '',
            objeto: ''
        });

        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Contrato agregado',
            text: 'El contrato ha sido agregado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    // Manejador para guardar un proyecto
    const handleGuardarProyecto = () => {
        // Validar campos obligatorios
        if (!newProject.nombre || !newProject.descripcion || !newProject.municipio) {
            Swal.fire({
                title: 'Campos obligatorios',
                text: 'Por favor complete los campos obligatorios del proyecto',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }
        
        // Si estamos en modo edición, actualizar el proyecto existente
        if (editMode) {
            // Actualizar en el servidor
            axios.put(`/parametros/actualizarProyecto/${currentProjectId}`, newProject)
                .then((response) => {
                    // Actualizar el estado local
                    const updatedProyectos = proyectos.map(p => 
                        p.id === currentProjectId ? { ...newProject, id: currentProjectId } : p
                    );
                    
                    setProyectos(updatedProyectos);
                    setFilteredProyectos(updatedProyectos);
                    
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        title: 'Proyecto actualizado',
                        text: 'El proyecto se ha actualizado correctamente',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    
                    // Limpiar el formulario y volver a la lista
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error al actualizar el proyecto:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo actualizar el proyecto',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                });
        } else {
            // Crear un nuevo proyecto
            axios.post('/parametros/guardarProyectos', newProject)
                .then((response) => {
                    // Añadir el nuevo proyecto al estado local
                    const nuevoProyecto = {
                        ...newProject,
                        id: response.data.id // Asumiendo que el servidor devuelve el ID
                    };
                    
                    const nuevosProyectos = [...proyectos, nuevoProyecto];
                    setProyectos(nuevosProyectos);
                    setFilteredProyectos(nuevosProyectos);
                    
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        title: 'Proyecto guardado',
                        text: 'El proyecto se ha guardado correctamente',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    });
                    
                    // Mostrar pestañas adicionales y cambiar a la pestaña de anexos
                    setShowContractsTab(true);
                    setShowAnnexesTab(true);
                    setActiveTab('anexos');
                })
                .catch((error) => {
                    console.error('Error al guardar el proyecto:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo guardar el proyecto',
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                });
        }
    };

    // Manejador para cambios en los anexos
    const handleAnnexChange = (e) => {
        const { name, value } = e.target;
        setNewAnnex({ ...newAnnex, [name]: value });
    };

    // Manejador para cambio de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tamaño máximo (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB en bytes
        if (file.size > maxSize) {
            Swal.fire({
                title: 'Archivo demasiado grande',
                text: 'El tamaño máximo permitido es 10MB',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Formatear tamaño para mostrar
        const size = file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(2)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

        // Actualizar estado del anexo
        setNewAnnex({
            ...newAnnex,
            nombre: file.name,
            archivo: file,
            fechaCarga: new Date().toLocaleDateString(),
            tamaño: size
        });
    };

    // Manejador para guardar un anexo
    const handleAddAnnex = (e) => {
        e.preventDefault();
        // Validación básica
        if (!newAnnex.archivo || !newAnnex.tipo) {
            Swal.fire({
                title: 'Campos requeridos',
                text: 'Por favor seleccione un archivo y el tipo de documento',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Generar un ID único para el nuevo anexo
        const id = Date.now();
        const newAnnexWithId = { ...newAnnex, id };

        // Agregar el anexo al arreglo de anexos
        setAnnexesData([...annexesData, newAnnexWithId]);

        // Cerrar el modal y resetear el formulario
        setShowAnnexModal(false);
        setNewAnnex({
            nombre: '',
            tipo: '',
            comentarios: '',
            archivo: null,
            fechaCarga: '',
            tamaño: ''
        });

        // Mostrar mensaje de éxito
        Swal.fire({
            title: 'Anexo agregado',
            text: 'El documento ha sido agregado correctamente',
            icon: 'success',
            confirmButtonText: 'OK',
        });
    };

    // Función para editar un proyecto - implementada directamente para evitar problemas
    const editarProyecto = (proyecto) => {
        console.log("Editando proyecto:", proyecto);
        
        // Establecer el modo de edición
        setEditMode(true);
        setCurrentProjectId(proyecto.id);
        
        // Establecer los datos del proyecto en el formulario
        setNewProject({
            nombre: proyecto.nombre || '',
            descripcion: proyecto.descripcion || '',
            municipio: proyecto.municipio || '',
            fechaInicio: proyecto.fechaInicio || '',
            fase: proyecto.fase || '',
            estado: proyecto.estado || '',
            presupuesto: proyecto.presupuesto || '',
            responsable: proyecto.responsable || '',
            categoria: proyecto.categoria || '',
        });
        
        // Mostrar el formulario de edición
        setShowForm(true);
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setNewProject({
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
        setEditMode(false);
        setCurrentProjectId(null);
        setShowForm(false);
        setShowContractsTab(false);
        setShowAnnexesTab(false);
        setActiveTab('informacion');
    };

    // Cargar datos iniciales al montar el componente
    useEffect(() => {
        cargarProyectos();
        cargarUsuarios();
        cargarMunicipios();
    }, []);

    // Filtrar proyectos cuando cambia el término de búsqueda
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProyectos(proyectos);
        } else {
            const filtered = proyectos.filter(proyecto =>
                proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proyecto.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proyecto.responsable.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProyectos(filtered);
        }
    }, [searchTerm, proyectos]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-800">Gestión de Proyectos</h1>
            
            {showForm ? (
                <FormularioProyecto
                    onClose={() => {
                        setShowForm(false);
                        setEditMode(false);
                        setCurrentProjectId(null);
                    }}
                    municipios={municipios}
                    usuarios={usuarios}
                    estadosData={estadosData}
                    loading={loading}
                    error={error}
                    contractsData={contractsData}
                    annexesData={annexesData}
                    handleGuardarProyecto={handleGuardarProyecto}
                    handleContractChange={handleContractChange}
                    handleAddContract={handleAddContract}
                    newContract={newContract}
                    setShowContractModal={setShowContractModal}
                    showContractModal={showContractModal}
                    handleAnnexChange={handleAnnexChange}
                    handleFileChange={handleFileChange}
                    handleAddAnnex={handleAddAnnex}
                    newAnnex={newAnnex}
                    setShowAnnexModal={setShowAnnexModal}
                    showAnnexModal={showAnnexModal}
                    newProject={newProject}
                    setNewProject={setNewProject}
                    editMode={editMode}
                />
            ) : (
                <TablaRegistros
                    title="Proyectos"
                    data={filteredProyectos}
                    columns={[
                        { accessor: 'nombre', header: 'Nombre' },
                        { accessor: 'municipio', header: 'Municipio' },
                        { accessor: 'responsable', header: 'Responsable' },
                        { 
                            accessor: 'presupuesto', 
                            header: 'Presupuesto', 
                            formatter: (value) => formatMoneda(value) 
                        },
                        { accessor: 'estado', header: 'Estado' },
                    ]}
                    onAddClick={() => {
                        setNewProject({
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
                        setEditMode(false);
                        setCurrentProjectId(null);
                        setShowForm(true);
                    }}
                    onEditClick={editarProyecto}
                    onDeleteClick={(proyecto) => {
                        Swal.fire({
                            title: '¿Está seguro?',
                            text: `¿Desea eliminar el proyecto "${proyecto.nombre}"?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí, eliminar',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Eliminar el proyecto del estado
                                const updatedProyectos = proyectos.filter(p => p.id !== proyecto.id);
                                setProyectos(updatedProyectos);
                                setFilteredProyectos(updatedProyectos);
                                
                                Swal.fire(
                                    '¡Eliminado!',
                                    'El proyecto ha sido eliminado correctamente.',
                                    'success'
                                );
                            }
                        });
                    }}
                    selectedCard="proyectos"
                />
            )}
        </div>
    );
};

export default Proyectos; 