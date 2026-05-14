import React from 'react';
import type { Task, TaskStatus } from '../types';
import { Calendar, Trash2, Edit2, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const statusColors = {
    todo: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  };

  const priorityColors = {
    low: 'text-green-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{task.title}</h3>
      <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">{task.description || 'No description provided.'}</p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center text-slate-400">
            <Calendar size={14} className="mr-1" />
            {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
          </div>
          <div className={`flex items-center font-medium ${priorityColors[task.priority]}`}>
            <AlertCircle size={14} className="mr-1" />
            {task.priority}
          </div>
        </div>
        
        {task.status !== 'done' ? (
          <button 
            onClick={() => onStatusChange(task.id, task.status === 'todo' ? 'in_progress' : 'done')}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center"
          >
            {task.status === 'todo' ? 'Start' : 'Finish'}
            <CheckCircle size={14} className="ml-1" />
          </button>
        ) : (
           <div className="text-xs font-medium text-green-600 flex items-center">
             Completed
             <CheckCircle size={14} className="ml-1" />
           </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
