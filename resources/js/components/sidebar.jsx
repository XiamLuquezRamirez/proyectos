import React from 'react';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white shadow-lg hidden md:block">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-8">WorkBoard</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                                <span>Empleados</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded">
                                <span>Reportes</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar; 