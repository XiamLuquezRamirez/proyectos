import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [selectedMunicipio, setSelectedMunicipio] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isProyectosModalOpen, setIsProyectosModalOpen] = useState(false);

    // Datos de ejemplo
    const eventos = [
        {
            id: 1,
            titulo: 'Formulación Proyecto Escuela',
            fecha: "2025-03-15",
            municipio: 'Municipio A',
            tipo: 'formulacion',
            estado: 'pendiente',
            hora: '09:00 AM'
        },
        {
            id: 2,
            titulo: 'Presentación Proyecto Vial',
            fecha: '2024-03-20',
            municipio: 'Municipio B',
            tipo: 'presentacion',
            estado: 'completado',
            hora: '10:00 AM'
        },
    ];

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

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

    const eventosMesActual = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getMonth() === currentDate.getMonth() &&
               fechaEvento.getFullYear() === currentDate.getFullYear();
    });

    // Datos de ejemplo para municipios y proyectos
    const municipiosConProyectos = [
        {
            id: 1,
            nombre: 'Municipio A',
            proyectosFormulacion: 5,
            imagen: '/ruta/imagen1.jpg'
        },
        {
            id: 2,
            nombre: 'Municipio B',
            proyectosFormulacion: 3,
            imagen: '/ruta/imagen2.jpg'
        },
        {
            id: 3,
            nombre: 'Municipio C',
            proyectosFormulacion: 7,
            imagen: '/ruta/imagen3.jpg'
        }
    ];

    const proyectosEjecucion = [
        {
            id: 1,
            nombre: 'Construcción Escuela Municipal',
            municipio: 'Municipio A',
            avance: 45,
            estado: 'En proceso'
        },
        {
            id: 2,
            nombre: 'Pavimentación Calle Principal',
            municipio: 'Municipio B',
            avance: 75,
            estado: 'Avanzado'
        }
    ];

    // Datos de ejemplo para los proyectos por municipio
    const proyectosPorMunicipio = {
        'Municipio A': [
            {
                id: 1,
                nombre: 'Construcción Escuela Primaria',
                sector: 'Educación',
                presupuesto: '1,500,000',
                estado: 'En revisión',
                fechaInicio: '2024-03-15'
            },
            {
                id: 2,
                nombre: 'Parque Municipal Fase I',
                sector: 'Recreación',
                presupuesto: '800,000',
                estado: 'Pendiente',
                fechaInicio: '2024-04-01'
            }
        ],
        'Municipio B': [
            {
                id: 3,
                nombre: 'Mejoramiento Vial Calle Principal',
                sector: 'Infraestructura',
                presupuesto: '2,300,000',
                estado: 'En revisión',
                fechaInicio: '2024-03-20'
            }
        ],
        // ... más proyectos por municipio
    };

    const handleMunicipioClick = (municipio) => {
        setSelectedMunicipio(municipio);
        setIsProyectosModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full gap-4 p-4">
                {/* Sección de Municipios (70%) */}
                <div className="w-[70%] rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold text-slate-800">
                        Proyectos en Formulación por Municipio
                    </h2>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                        {municipiosConProyectos.map(municipio => (
                            <div 
                                key={municipio.id}
                                onClick={() => handleMunicipioClick(municipio)}
                                className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-lg"
                            >
                                <div className="mb-4 h-32 overflow-hidden rounded-lg bg-slate-100">
                                    <div className="h-full w-full bg-gradient-to-br from-emerald-500 to-teal-600 opacity-75" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-slate-800">
                                    {municipio.nombre}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        Proyectos en formulación:
                                    </span>
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                                        {municipio.proyectosFormulacion}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sección de Proyectos en Ejecución (30%) */}
                <div className="w-[30%] rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold text-slate-800">
                        Proyectos en Ejecución
                    </h2>
                    <div className="space-y-4">
                        {proyectosEjecucion.map(proyecto => (
                            <div 
                                key={proyecto.id}
                                className="rounded-lg border border-slate-200 p-4 transition-all hover:bg-slate-50"
                            >
                                <h3 className="mb-2 font-medium text-slate-800">
                                    {proyecto.nombre}
                                </h3>
                                <p className="mb-3 text-sm text-slate-600">
                                    {proyecto.municipio}
                                </p>
                                <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                    <div 
                                        className="h-full bg-emerald-500" 
                                        style={{ width: `${proyecto.avance}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                        Avance: {proyecto.avance}%
                                    </span>
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                                        {proyecto.estado}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Botón flotante del calendario */}
            <button
                onClick={() => setIsCalendarModalOpen(true)}
                className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
            >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {/* Modal del Calendario */}
            {isCalendarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="max-h-[90vh] w-[90vw] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
                        {/* Encabezado y navegación */}
                        <div className="mb-8">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    Calendario de Eventos
                                </h2>
                                <button 
                                    onClick={() => setIsCalendarModalOpen(false)}
                                    className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={mesAnterior}
                                    className="rounded-lg bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200"
                                >
                                    ← Anterior
                                </button>
                                <h3 className="text-xl font-semibold text-slate-700">
                                    {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h3>
                                <button
                                    onClick={mesSiguiente}
                                    className="rounded-lg bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>

                        {/* Lista de eventos */}
                        <div className="space-y-6">
                            {eventosMesActual.length > 0 ? (
                                Object.entries(
                                    eventosMesActual.reduce((grupos, evento) => {
                                        if (!grupos[evento.fecha]) {
                                            grupos[evento.fecha] = [];
                                        }
                                        grupos[evento.fecha].push(evento);
                                        return grupos;
                                    }, {})
                                )
                                .sort(([fechaA], [fechaB]) => 
                                    new Date(fechaA) - new Date(fechaB)
                                )
                                .map(([fecha, eventosDelDia]) => {
                                    const fechaObj = ajustarFecha(fecha);
                                    return (
                                        <div key={fecha} className="rounded-xl border border-slate-200 bg-white">
                                            {/* Cabecera del día */}
                                            <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-2xl font-bold text-slate-800">
                                                        {fechaObj.getDate()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-700">
                                                            {fechaObj.toLocaleDateString('es-ES', { weekday: 'long' })}
                                                        </div>
                                                        <div className="text-sm text-slate-600">
                                                            {fechaObj.toLocaleDateString('es-ES', { 
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Eventos del día */}
                                            <div className="divide-y divide-slate-100">
                                                {eventosDelDia.map(evento => (
                                                    <div 
                                                        key={evento.id}
                                                        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50"
                                                    >
                                                        <div className="w-20 text-sm font-medium text-slate-600">
                                                            {evento.hora}
                                                        </div>
                                                        <div className={`h-full w-1 rounded-full ${
                                                            evento.tipo === 'formulacion' 
                                                                ? 'bg-emerald-500' 
                                                                : 'bg-blue-500'
                                                        }`} />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-slate-800">
                                                                {evento.titulo}
                                                            </h4>
                                                            <p className="text-sm text-slate-600">
                                                                {evento.municipio}
                                                            </p>
                                                        </div>
                                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                            evento.estado === 'completado'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {evento.estado}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                                    <p className="text-slate-600">No hay eventos programados para este mes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Proyectos del Municipio */}
            {isProyectosModalOpen && selectedMunicipio && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-100">
                    <div className="max-h-[90vh] w-[90vw] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl md:w-[80vw] lg:w-[70vw]">
                        {/* Encabezado del modal */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {selectedMunicipio.nombre}
                                </h2>
                                <p className="text-slate-600">
                                    Listado de proyectos en formulación
                                </p>
                            </div>
                            <button 
                                onClick={() => setIsProyectosModalOpen(false)}
                                className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Tabla de proyectos */}
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Nombre del Proyecto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Sector
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Presupuesto
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Estado
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Fecha Inicio
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {proyectosPorMunicipio[selectedMunicipio.nombre]?.map((proyecto) => (
                                        <tr key={proyecto.id} className="hover:bg-slate-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="font-medium text-slate-900">{proyecto.nombre}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {proyecto.sector}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                ${proyecto.presupuesto}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    proyecto.estado === 'En revisión' 
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {proyecto.estado}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {proyecto.fechaInicio}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
