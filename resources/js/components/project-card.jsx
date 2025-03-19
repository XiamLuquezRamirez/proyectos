export default function ProjectCard({ title, progress, daysLeft, totalTasks }) {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <button className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>
            
            <div className="mb-2">Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            
            <div className="flex justify-between text-sm">
                <div className="text-gray-600">{totalTasks} tasks</div>
                <div className="text-pink-400">{daysLeft} days left</div>
            </div>
        </div>
    );
} 