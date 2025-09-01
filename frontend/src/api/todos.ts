import { apiClient } from './client';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

export const todosApi = {
    getTodos: async (): Promise<Todo[]> => {
        const response = await apiClient.get<Todo[]>('/todos/');
        return response.data;
    },

    getTodo: async (id: number): Promise<Todo> => {
        const response = await apiClient.get<Todo>(`/todos/${id}`);
        return response.data;
    },

    createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
        const response = await apiClient.post<Todo>('/todos/', todo);
        return response.data;
    },

    updateTodo: async (id: number, todo: UpdateTodoRequest): Promise<Todo> => {
        const response = await apiClient.put<Todo>(`/todos/${id}`, todo);
        return response.data;
    },

    deleteTodo: async (id: number): Promise<void> => {
        await apiClient.delete(`/todos/${id}`);
    },
};
