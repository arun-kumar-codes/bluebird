import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../api/todos';
import { CreateTodoRequest, UpdateTodoRequest } from '../types';

export const useTodos = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: todosApi.getTodos,
    });
};

export const useTodo = (id: number) => {
    return useQuery({
        queryKey: ['todos', id],
        queryFn: () => todosApi.getTodo(id),
        enabled: !!id,
    });
};

export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todo: CreateTodoRequest) => todosApi.createTodo(todo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, todo }: { id: number; todo: UpdateTodoRequest }) =>
            todosApi.updateTodo(id, todo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => todosApi.deleteTodo(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        },
    });
};
