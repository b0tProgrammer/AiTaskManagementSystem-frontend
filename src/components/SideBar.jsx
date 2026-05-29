import React, { useMemo } from "react";
import { LogOut } from "lucide-react";
import Spinner from './Spinner';
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { tasks = [], filteredTasks = [], filter, setFilter, isLoading } = useTasks();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };
  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col fixed right-0 top-0 h-screen shadow-lg">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Filters</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setFilter('ALL')} className={`px-3 py-1 rounded-md ${filter==='ALL' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All ({tasks.length})</button>
          <button onClick={() => setFilter('OVERDUE')} className={`px-3 py-1 rounded-md ${filter==='OVERDUE' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}>Overdue ({tasks.filter(t => t.dueDate && new Date(t.dueDate) < today).length})</button>
          <button onClick={() => setFilter('DUE_TODAY')} className={`px-3 py-1 rounded-md ${filter==='DUE_TODAY' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700'}`}>Due Today ({tasks.filter(t => t.dueDate && (new Date(t.dueDate).setHours(0,0,0,0) === today.getTime())).length})</button>
          <button onClick={() => setFilter('HIGH')} className={`px-3 py-1 rounded-md ${filter==='HIGH' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}>High ({tasks.filter(t => t.priority==='HIGH').length})</button>
          <button onClick={() => setFilter('MEDIUM')} className={`px-3 py-1 rounded-md ${filter==='MEDIUM' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Medium ({tasks.filter(t => t.priority==='MEDIUM').length})</button>
          <button onClick={() => setFilter('LOW')} className={`px-3 py-1 rounded-md ${filter==='LOW' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Low ({tasks.filter(t => t.priority==='LOW').length})</button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500 font-medium">Showing:</p>
          <p className="text-sm font-semibold text-gray-800">{filter === 'ALL' ? 'All Tasks' : filter.replace('_', ' ')}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6 grid grid-cols-2 gap-y-6">
        <div>
          <p className="text-xs text-gray-500 font-medium">Total Tasks:</p>
          <p className="text-3xl font-light text-gray-800">
            <span className="text-indigo-500 font-bold mr-1">|</span> {tasks.length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">In Progress:</p>
          <p className="text-3xl font-light text-gray-800">
            <span className="text-teal-500 font-bold mr-1">|</span> {tasks.filter(t => t.status === 'IN_PROGRESS').length || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Open Tasks:</p>
          <p className="text-3xl font-light text-gray-800">
            <span className="text-orange-400 font-bold mr-1">|</span> {tasks.filter(t => !(t.status === 'DONE')).length}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Completed:</p>
          <p className="text-3xl font-light text-gray-800">
            <span className="text-green-500 font-bold mr-1">|</span> {tasks.filter(t => t.status === 'DONE').length}
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <ul className="max-h-40 overflow-auto space-y-2">
            {isLoading && (
              <li className="flex items-center">
                <Spinner size={4} label="Loading..." />
              </li>
            )}
            {!isLoading && tasks.length === 0 && <li className="text-xs text-gray-500">No tasks yet.</li>}
            {!isLoading && tasks.slice(0,8).map(t => (
              <li key={t.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-md p-2">
                <span className="text-sm text-gray-700 truncate">{t.title}</span>
                <span className="text-xs text-gray-400">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}</span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleLogout} className="w-full py-3 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
          Sign Out
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
