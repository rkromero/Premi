import { create } from 'zustand';
import { TaskStore, Task, TaskStatus } from '../types';
import apiService from '../services/api';

const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  // Obtener tareas
  fetchTasks: async (params?: any) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getTasks(params);
      set({ 
        tasks: response.data, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Error al obtener tareas' 
      });
    }
  },

  // Crear nueva tarea
  createTask: async (taskData: Partial<Task>) => {
    set({ loading: true, error: null });
    try {
      const newTask = await apiService.createTask({
        titulo: taskData.titulo!,
        descripcion: taskData.descripcion,
        puntos: taskData.puntos!,
        asignadoA: taskData.asignadoA,
        fechaLimite: taskData.fechaLimite,
      });
      
      const currentTasks = get().tasks;
      set({ 
        tasks: [newTask, ...currentTasks], 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Error al crear tarea' 
      });
    }
  },

  // Actualizar tarea
  updateTask: async (id: string, data: Partial<Task>) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await apiService.updateTask(id, data);
      
      const currentTasks = get().tasks;
      const updatedTasks = currentTasks.map(task => 
        task.id === id ? updatedTask : task
      );
      
      set({ 
        tasks: updatedTasks, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Error al actualizar tarea' 
      });
    }
  },

  // Actualizar estado de tarea
  updateTaskStatus: async (id: string, status: TaskStatus) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await apiService.updateTaskStatus(id, status);
      
      const currentTasks = get().tasks;
      const updatedTasks = currentTasks.map(task => 
        task.id === id ? updatedTask : task
      );
      
      set({ 
        tasks: updatedTasks, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Error al actualizar estado de tarea' 
      });
    }
  },

  // Eliminar tarea
  deleteTask: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await apiService.deleteTask(id);
      
      const currentTasks = get().tasks;
      const filteredTasks = currentTasks.filter(task => task.id !== id);
      
      set({ 
        tasks: filteredTasks, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.message || 'Error al eliminar tarea' 
      });
    }
  },

  // Limpiar tareas
  clearTasks: () => {
    set({ 
      tasks: [], 
      loading: false, 
      error: null 
    });
  },
}));

export default useTaskStore; 