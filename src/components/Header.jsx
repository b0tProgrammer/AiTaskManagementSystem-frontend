import React from 'react';
import { Plus, Moon, User } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const Header = () => {
  const { tasks = [], openModal } = useTasks();
  const username = (typeof window !== 'undefined' && localStorage.getItem('username')) || 'User';
  const activeCount = tasks.length || 0;

  return (
    <header className="flex justify-between items-center p-6 bg-[#f5f6f8]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
          T
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">Welcome, {username}!</h2>
          <p className="text-sm text-gray-500">You have <span className="font-bold text-indigo-600">{activeCount} active</span> tasks</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => openModal()} className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full shadow-sm transition-colors">
          <Plus size={18} />
          Add a new Task
        </button>
        
        <div className="flex gap-2 text-gray-600">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Moon size={20} /></button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors"><User size={20} /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;