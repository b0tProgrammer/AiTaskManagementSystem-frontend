import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import Spinner from './Spinner';

const TaskGrid = () => {
  const { tasks, filteredTasks, openModal, deleteTask, isLoading } = useTasks();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8); // default for larger screens

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setPageSize(mq.matches ? 6 : 8);
    update();
    mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update);
    return () => mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize, filteredTasks.length, tasks.length]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedTasks = filteredTasks.slice(start, end);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'text-red-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full col-span-full flex items-center justify-center py-20">
          <Spinner label="Loading tasks..." />
        </div>
      ) : (
        <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedTasks.map(task => (
          <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col h-64 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-4">{task.description}</p>
              </div>
              <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
              <div>
                <div className="text-xs text-gray-400 font-medium">Est: {task.estimatedTime || 'N/A'}</div>
                <div className="text-xs text-gray-500">Due: {task.dueDate || 'N/A'}</div>
              </div>
              <div className="flex items-center gap-4">
                  <span className={"text-xs font-bold lowercase " + getPriorityColor(task.priority)}>
                    {task.priority}
                  </span>
                  {(() => {
                    const statusClass = task.status === 'DONE'
                      ? 'bg-green-100 text-green-700'
                      : task.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700';
                    return (
                      <span className={"text-xs font-semibold px-2 py-1 rounded-full " + statusClass}>
                        {task.status || 'TODO'}
                      </span>
                    );
                  })()}
                <div className="flex gap-2">
                  <button onClick={() => openModal(task)} className="text-blue-400 hover:text-blue-600 transition-colors"><Edit size={16} /></button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

      
        <div 
          onClick={() => openModal()}
          className="border-2 border-dashed border-gray-300 rounded-xl h-64 flex flex-col items-center justify-center text-gray-500 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer group"
        >
          <span className="font-medium">Add New Task</span>
        </div>
      </div>


      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600">Showing {Math.min(start+1, tasks.length)} - {Math.min(end, tasks.length)} of {tasks.length}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p-1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
          >Prev</button>
          <div className="flex items-center gap-1">
            {Array.from({length: totalPages}).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i+1)}
                className={
                  'px-3 py-1 rounded-md ' +
                  (currentPage===i+1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200')
                }
              >{i+1}</button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-200 bg-white text-gray-700 disabled:opacity-50"
          >Next</button>
        </div>
      </div>
      </div>
    )}
    </div>
  );
};

export default TaskGrid;