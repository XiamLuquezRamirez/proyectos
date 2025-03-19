import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { type BreadcrumbItem, type SharedData } from '@/types';
export default function AppLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header con navegación superior */}
            <header className="bg-white shadow-sm">
                <div className="flex h-16 items-center justify-between px-4">
                    {/* Logo o título */}
                    <div className="flex items-center">
                        {/* Cargar imagen logo */}
                     
                    </div>

                    {/* Menú de usuario en la esquina superior derecha */}
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-slate-100"
                        >
                            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white">
                                {/* Iniciales del usuario o avatar */}
                                <span className="flex h-full w-full items-center justify-center text-sm font-medium">
                                    {
                                    //tomar inciales de nombre y apellido
                                    auth.user.name.split(' ').map(name => name.charAt(0)).join('')
                                    }
                                </span>
                            </div>
                            <span className="text-sm font-medium text-slate-700">
                                {auth.user.name} 
                            </span>
                            <svg
                                className="h-5 w-5 text-slate-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Menú desplegable */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
   
   
                                <Link
                                    href="/settings"
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    <svg 
                                        className="h-5 w-5 text-slate-500" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                    </svg>
                                    Configuración
                                </Link>
                                <hr className="my-1" />
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100"
                                >
                                    <svg 
                                        className="h-5 w-5 text-red-500" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                                        />
                                    </svg>
                                    Cerrar Sesión
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Breadcrumbs */}
                {breadcrumbs && (
                    <div className="border-t border-slate-200 px-4 py-2">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-2">
                                {breadcrumbs.map((item, index) => (
                                    <li key={item.href}>
                                        <div className="flex items-center">
                                            {index > 0 && (
                                                <svg
                                                    className="h-5 w-5 text-slate-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                            <Link
                                                href={item.href}
                                                className={`ml-2 text-sm ${
                                                    index === breadcrumbs.length - 1
                                                        ? 'font-medium text-slate-800'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                            >
                                                {item.title}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                )}
            </header>

            {/* Contenido principal */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
