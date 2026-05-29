import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Sparkles } from 'lucide-react';

const TaskModal = () => {
  const { isModalOpen, closeModal, addTask, updateTask, editingTask } = useTasks();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    status: 'TODO',
    estimatedTime: '',
    dueDate: ''
  });

  useEffect(() => {
    if (editingTask) {
      // Ensure missing fields are defaulted when editing
      setFormData({
        id: editingTask.id,
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'MEDIUM',
        status: editingTask.status || 'TODO',
        estimatedTime: editingTask.estimatedTime || '',
        dueDate: editingTask.dueDate || ''
      });
    } else {
      setFormData({ title: '', description: '', priority: 'MEDIUM', status: 'TODO', estimatedTime: '', dueDate: '' });
    }
  }, [editingTask, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      if (editingTask) {
        await updateTask(formData);
      } else {
        await addTask(formData);
      }
      closeModal();
    })();
  };

  const handleAiAssist = async () => {
    if (!formData.title) return alert("Please enter a title first!");
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${API_BASE}/api/tasks/aiDesc?title=${encodeURIComponent(formData.title)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setFormData({
          ...formData,
          description: result.data.description,
          priority: result.data.priority || 'MEDIUM',
          estimatedTime: result.data.estimatedTime || ''
        });
      }
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <button 
                type="button" 
                onClick={handleAiAssist} 
                disabled={isGenerating}
                className="px-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Sparkles size={18} />
                {isGenerating ? '...' : 'AI'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500 h-24 resize-none"
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
              <select 
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Est. Time</label>
              <input 
                type="text" 
                placeholder="e.g., 2 hours"
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                value={formData.estimatedTime || ''}
                onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-indigo-500"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors shadow-sm">
              {editingTask ? 'Update Task' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;