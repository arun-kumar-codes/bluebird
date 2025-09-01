import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../api/notes';
import { CreateNoteRequest, UpdateNoteRequest } from '../types';

export const useNotes = () => {
    return useQuery({
        queryKey: ['notes'],
        queryFn: notesApi.getNotes,
    });
};

export const useNote = (id: number) => {
    return useQuery({
        queryKey: ['notes', id],
        queryFn: () => notesApi.getNote(id),
        enabled: !!id,
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (note: CreateNoteRequest) => notesApi.createNote(note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, note }: { id: number; note: UpdateNoteRequest }) =>
            notesApi.updateNote(id, note),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => notesApi.deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });
};
