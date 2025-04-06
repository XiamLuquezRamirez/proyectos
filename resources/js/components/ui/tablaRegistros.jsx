import React from 'react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const TablaRegistros = ({ 
    title, 
    data, 
    columns, 
    onAddClick, 
    onEditClick, 
    onDeleteClick, 
    selectedCard,
    showButtons = true
}) => {
    return (
        <div className="mx-auto mt-8 w-full max-w-10xl">
            <div className="rounded-lg bg-white shadow-md">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                        {showButtons && (
                            <button
                                type="button"
                                onClick={onAddClick}
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Nuevo {selectedCard === 'proyectos' ? 'Proyecto' : selectedCard === 'usuarios' ? 'Usuario' : 'Evento'}</span>
                            </button>
                        )}
                    </div>
                    <div className="mt-4 flex items-center overflow-hidden rounded-lg border">
                        <Search className="ml-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Buscar ${title.toLowerCase()}...`}
                            className="w-full px-3 py-2 text-gray-700 focus:outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                    >
                                        {column.header || column.label}
                                    </th>
                                ))}
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {columns.map((column, colIndex) => {
                                        const key = column.accessor || column.key;
                                        const value = item[key];
                                        
                                        return (
                                            <td key={colIndex} className="whitespace-nowrap px-6 py-4">
                                                {key === 'estado' ? (
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                            value === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {value}
                                                    </span>
                                                ) : column.formatter ? (
                                                    <div className="text-gray-900">{column.formatter(value)}</div>
                                                ) : (
                                                    <div className="text-gray-900">{value}</div>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Función directa para editar
                                                console.log("Botón editar clickeado", item);
                                                if (typeof onEditClick === 'function') {
                                                    onEditClick(item);
                                                } else {
                                                    alert("La función de edición no está implementada");
                                                }
                                            }}
                                            className="mr-3 text-indigo-600 hover:text-indigo-900"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Función directa para eliminar
                                                if (typeof onDeleteClick === 'function') {
                                                    onDeleteClick(item);
                                                } else {
                                                    Swal.fire({
                                                        title: '¿Está seguro?',
                                                        text: 'Esta acción no se puede deshacer',
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Sí, eliminar',
                                                        cancelButtonText: 'Cancelar'
                                                    });
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No hay registros disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 p-4">
                    <div className="text-sm text-gray-500">
                        Mostrando {data.length} de {data.length} registros
                    </div>
                    <div className="flex gap-2">
                        <button type="button" className="rounded border px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                            Anterior
                        </button>
                        <button type="button" className="rounded border px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TablaRegistros;
