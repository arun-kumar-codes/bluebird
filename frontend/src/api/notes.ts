import { apiClient } from './client';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

export const notesApi = {
    getNotes: async (): Promise<Note[]> => {
        const response = await apiClient.get<Note[]>('/notes/');
        return response.data;
    },

    getNote: async (id: number): Promise<Note> => {
        const response = await apiClient.get<Note>(`/notes/${id}`);
        return response.data;
    },

    createNote: async (note: CreateNoteRequest): Promise<Note> => {
        const response = await apiClient.post<Note>('/notes/', note);
        return response.data;
    },

    updateNote: async (id: number, note: UpdateNoteRequest): Promise<Note> => {
        const response = await apiClient.put<Note>(`/notes/${id}`, note);
        return response.data;
    },

    deleteNote: async (id: number): Promise<void> => {
        await apiClient.delete(`/notes/${id}`);
    },
};
