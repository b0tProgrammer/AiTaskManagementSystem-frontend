import React from 'react';
import Sidebar from '../components/SideBar';
import Header from '../components/Header';
import TaskGrid from '../components/TaskGrid';
import TaskModal from '../components/TaskModal';
import { TaskProvider } from '../context/TaskContext';
import { useTasks } from '../context/TaskContext';

const DashboardInner = () => {
  const { filter, filteredTasks } = useTasks();

  const titleMap = {
    ALL: 'All Tasks',
    OVERDUE: 'Overdue Tasks',
    DUE_TODAY: 'Due Today',
    HIGH: 'High Priority',
    MEDIUM: 'Medium Priority',
    LOW: 'Low Priority'
  };

  const title = titleMap[filter] || 'Tasks';

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f5f6f8] p-6 pr-80"> 
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{title} ({filteredTasks.length})</h1>
          
        </div>
        
        <TaskGrid />
      </main>
    </div>
  );
};

const Dashboard = () => (
  <TaskProvider>
    <div className="flex h-screen bg-[#f5f6f8] font-sans">
      <DashboardInner />
      <Sidebar />
      <TaskModal /> 
    </div>
  </TaskProvider>
);

export default Dashboard;