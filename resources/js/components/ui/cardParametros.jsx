import React from 'react';
import { FolderIcon, Calendar, UserIcon, Settings } from 'lucide-react';

const CardParametros = ({ title, description, count, color, onClick }) => {
    // Determinar el icono y color basado en el título
    let icon = <FolderIcon className="h-7 w-7" />;
    let bgColor = "bg-blue-500";
    let iconBgColor = "bg-blue-100";
    let iconColor = "text-blue-600";
    let textColor = "text-blue-600";
    let bgHoverColor = "bg-blue-50";

    if (title === "Eventos") {
        icon = <Calendar className="h-7 w-7" />;
        bgColor = "bg-amber-500";
        iconBgColor = "bg-amber-100";
        iconColor = "text-amber-600";
        textColor = "text-amber-600";
        bgHoverColor = "bg-amber-50";
    } else if (title === "Usuarios") {
        icon = <UserIcon className="h-7 w-7" />;
        bgColor = "bg-purple-500";
        iconBgColor = "bg-purple-100";
        iconColor = "text-purple-600";
        textColor = "text-purple-600";
        bgHoverColor = "bg-purple-50";
    }

    return (
        <div onClick={onClick} className="transform cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
            <div className={`${bgColor} p-1`}></div>
            <div className="p-6">
                <div className="mb-4 flex items-center gap-4">
                    <div className={`rounded-full ${iconBgColor} p-3`}>
                        <span className={iconColor}>{icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                </div>
                <p className="mb-4 text-gray-500">{description}</p>
                <div className="flex items-center justify-between">
                    <span className={`text-sm ${textColor}`}>{count} {title} registrados</span>
                    <div className={`rounded-full ${bgHoverColor} p-2`}>
                        <Settings className={`h-5 w-5 ${iconColor}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardParametros;

