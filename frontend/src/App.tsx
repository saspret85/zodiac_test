import { useState } from 'react';
import api from './api/client';
import type { Task, TaskStatus, TaskPriority, TasksResponse } from './types';
import TaskCard from './components/TaskCard';
import { Plus, Filter, ChevronLeft, ChevronRight, Loader2, Search, CheckCircle, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();
  
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
    dueDate: '',
  });

  const { data: tasksResponse, isLoading: loading, error: queryError } = useQuery<TasksResponse>({
    queryKey: ['tasks', { status: statusFilter, priority: priorityFilter, page }],
    queryFn: async () => {
      const response = await api.get('/tasks', {
        params: {
          status: statusFilter || undefined,
          priority: priorityFilter || undefined,
          page,
          limit: 8,
        },
      });
      return response.data;
    }
  });

  const tasks = tasksResponse?.data || [];
  const meta = tasksResponse?.meta || { total: 0, page: 1, limit: 8, totalPages: 0 };

  const createOrUpdateMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingTask) {
        return api.patch('/tasks/' + editingTask.id, payload);
      }
      return api.post('/tasks', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(editingTask ? 'Task updated successfully' : 'Task created successfully');
      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    },
    onError: (err: any) => {
      const backendMessage = err.response?.data?.message;
      toast.error(backendMessage || 'Operation failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete('/tasks/' + id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: (err: any) => {
        const backendMessage = err.response?.data?.message;
        toast.error(backendMessage || 'Failed to delete task');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => api.patch('/tasks/' + id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Moved to ' + variables.status.replace('_', ' '));
    },
    onError: (err: any) => {
        const backendMessage = err.response?.data?.message;
        toast.error(backendMessage || 'Failed to update status');
    }
  });

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };
    createOrUpdateMutation.mutate(payload);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Toaster position="bottom-right" />
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 m-0 tracking-tight">TaskFlow</h1>
          </div>
          <button 
            onClick={() => {
              setEditingTask(null);
              setFormData({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-sm"
          >
            <Plus size={18} className="mr-1.5" />
            New Task
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:outline-none min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <select 
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value as any); setPage(1); }}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-indigo-500 focus:outline-none min-w-[140px]"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-800">{tasks.length}</span> of {meta.total} tasks
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="text-indigo-600 animate-spin" size={40} />
            <p className="text-slate-500 font-medium">Loading your tasks...</p>
          </div>
        ) : queryError ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
            <AlertCircle className="text-red-500 mx-auto mb-3" size={40} />
            <h3 className="text-red-800 font-semibold mb-1">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{(queryError as any).response?.data?.message || 'Failed to fetch tasks'}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <h3 className="text-slate-800 font-semibold text-lg mb-1">No tasks found</h3>
            <p className="text-slate-500 mb-6">Start by creating a new task or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={openEditModal}
                onDelete={(id) => deleteMutation.mutate(id)}
                onStatusChange={(id, status) => statusMutation.mutate({ id, status })}
              />
            ))}
          </div>
        )}

        {!loading && meta.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(meta.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={'w-10 h-10 rounded-lg text-sm font-semibold transition-all ' + (page === i + 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300')}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === meta.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 m-0">
                {editingTask ? 'Edit Task' : 'New Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="pt-6 flex items-center space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={createOrUpdateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50"
                >
                  {createOrUpdateMutation.isPending ? 'Saving...' : (editingTask ? 'Save Changes' : 'Create Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;