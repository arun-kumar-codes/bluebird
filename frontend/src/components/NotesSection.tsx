import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '../hooks/useNotes';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../types';

const NotesSection: React.FC = () => {
    const { user } = useAuth();
    const { data: notes, isLoading, error } = useNotes();
    const createNoteMutation = useCreateNote();
    const updateNoteMutation = useUpdateNote();
    const deleteNoteMutation = useDeleteNote();

    const [isCreating, setIsCreating] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [newNote, setNewNote] = useState<CreateNoteRequest>({ title: '', content: '' });
    const [editNote, setEditNote] = useState<UpdateNoteRequest>({ title: '', content: '' });

    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.title.trim()) return;

        try {
            await createNoteMutation.mutateAsync(newNote);
            setNewNote({ title: '', content: '' });
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    };

    const handleUpdateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNote || !editNote.title?.trim()) return;

        try {
            await updateNoteMutation.mutateAsync({ id: editingNote.id, note: editNote });
            setEditingNote(null);
            setEditNote({ title: '', content: '' });
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    const handleDeleteNote = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await deleteNoteMutation.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const startEditing = (note: Note) => {
        setEditingNote(note);
        setEditNote({ title: note.title, content: note.content });
    };

    const canDelete = user?.role === 'admin';

    if (isLoading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
                <div className="text-center">Loading notes...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>
                <div className="text-red-600">Error loading notes</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Notes</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                    Add Note
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateNote} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Note title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            placeholder="Note content"
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            rows={3}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            disabled={createNoteMutation.isPending}
                            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                            {createNoteMutation.isPending ? 'Creating...' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {notes?.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No notes yet. Create your first note!
                    </div>
                ) : (
                    notes?.map((note) => (
                        <div key={note.id} className="border rounded-lg p-4">
                            {editingNote?.id === note.id ? (
                                <form onSubmit={handleUpdateNote}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            value={editNote.title}
                                            onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            value={editNote.content}
                                            onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            disabled={updateNoteMutation.isPending}
                                            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {updateNoteMutation.isPending ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingNote(null)}
                                            className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                                        <div className="flex space-x-2">
                                            {(user?.id === note.created_by || user?.role === 'admin') && (
                                                <button
                                                    onClick={() => startEditing(note)}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    disabled={deleteNoteMutation.isPending}
                                                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {note.content && (
                                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                    )}
                                    <div className="mt-2 text-xs text-gray-500">
                                        Created: {new Date(note.created_at).toLocaleDateString()}
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesSection;
