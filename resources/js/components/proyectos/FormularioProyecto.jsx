                {showAnnexModal && (
                    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-gray-600">
                        <div className="max-h-[90vh] w-full max-w-10xl overflow-y-auto rounded-lg bg-white shadow-xl">
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

const FormularioProyecto = ({ 
    onClose, 
    municipios, 
    usuarios, 
    estadosData, 
    loading,
    error,
    contractsData,
    annexesData,
    handleGuardarProyecto,
    handleContractChange,
    handleAddContract,
    newContract,
    setShowContractModal,
    showContractModal,
    handleAnnexChange,
    handleFileChange,
    handleAddAnnex,
    newAnnex,
    setShowAnnexModal,
    showAnnexModal,
    newProject,
    setNewProject,
    editMode
}) => {
    const [activeTab, setActiveTab] = useState('informacion');
    const [showContractsTab, setShowContractsTab] = useState(editMode); // Mostrar tabs si estamos editando
    const [showAnnexesTab, setShowAnnexesTab] = useState(editMode); // Mostrar tabs si estamos editando

    const handlePresupuestoChange = (e) => {
        // Obtener solo los dígitos del valor ingresado
        const inputValue = e.target.value;
        const numericValue = inputValue.replace(/[^0-9]/g, '');
        
        // Actualizar el estado con el valor numérico
        setNewProject({
            ...newProject, 
            presupuesto: numericValue
        });
    };

    // Función para formatear valores monetarios
    const formatMoneda = (value) => {
        if (!value && value !== 0) return '';
        
        // Asegurarse de que value sea un número
        const numericValue = typeof value === 'string' ? 
            parseInt(value.replace(/[^\d]/g, '')) : 
            parseInt(value);
        
        return new Intl.NumberFormat('es-CO').format(numericValue);
    };

    return (
        <div className="mx-auto mt-8 w-full max-w-2xl">
            <div className="rounded-lg bg-white shadow-md">
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {editMode ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Volver</span>
                    </button>
                </div>

                <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                        type="text"
                        className="w-full rounded-md border border-gray-300 py-2 pr-12 pl-7 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        required
                        onChange={handlePresupuestoChange}
                        placeholder="0"
                        value={newProject.presupuesto ? formatMoneda(newProject.presupuesto) : ''}
                    />
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

                        {(showAnnexesTab || editMode) && (
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

                        {(showContractsTab || editMode) && (
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
                                                    <option key={municipio.id} value={municipio.nombre}>
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
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full rounded-md border border-gray-300 py-2 pr-12 pl-7 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                required
                                                onChange={handlePresupuestoChange}
                                                placeholder="0"
                                                value={newProject.presupuesto ? formatMoneda(newProject.presupuesto) : ''}
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
                                                        <option key={usuario.id} value={usuario.nombre}>
                                                            {usuario.nombre}
                                                        </option>
                                                    ))
                                                )}
                                            </select>
                                            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
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

                                <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleGuardarProyecto}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                                    >
                                        {editMode ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === 'anexos' && (
                            <div className="space-y-6">
                                {/* Código para anexos */}
                                {/* ... */}
                            </div>
                        )}

                        {activeTab === 'contratos' && (
                            <div className="space-y-6">
                                {/* Código para contratos */}
                                {/* ... */}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioProyecto; 