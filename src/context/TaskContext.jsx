import React, { createContext, useState, useEffect, useContext } from 'react';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Fetch all tasks from Spring Boot
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tasks/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) setTasks(result.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tasks/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(taskData)
      });
      if (response.ok) await fetchTasks();
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tasks/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(taskData)
      });
      if (response.ok) await fetchTasks();
    } catch (error) {
      console.error("Failed to update task", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tasks/delete?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = React.useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    switch(filter) {
      case 'OVERDUE':
        return tasks.filter(t => t.dueDate && new Date(t.dueDate) < today);
      case 'DUE_TODAY':
        return tasks.filter(t => {
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          d.setHours(0,0,0,0);
          return d.getTime() === today.getTime();
        });
      case 'HIGH':
        return tasks.filter(t => t.priority === 'HIGH');
      case 'MEDIUM':
        return tasks.filter(t => t.priority === 'MEDIUM');
      case 'LOW':
        return tasks.filter(t => t.priority === 'LOW');
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, filteredTasks, filter, setFilter, isLoading,
      addTask, updateTask, deleteTask, 
      isModalOpen, openModal, closeModal, editingTask 
    }}>
      {children}
    </TaskContext.Provider>
  );
};