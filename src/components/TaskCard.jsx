import React from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';

const TaskCard = ({ task }) => {
  // Determine priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col h-64 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-4">{task.description}</p>
      </div>
      
      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
        <div>
          <div className="text-xs text-gray-400 font-medium">Created: {task.date || 'N/A'}</div>
          <div className="text-xs text-gray-500">Due: {task.dueDate || 'N/A'}</div>
        </div>

        <div className="flex items-center gap-4">
          <span className={`text-xs font-bold lowercase ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${task.status === 'DONE' ? 'bg-green-100 text-green-700' : task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
            {task.status || 'TODO'}
          </span>
          <div className="flex gap-2">
            <button className="text-gray-300 hover:text-yellow-400 transition-colors"><Star size={16} fill="currentColor" /></button>
            <button className="text-blue-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
            <button className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};