import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '../hooks/useTodos';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

const TodosSection: React.FC = () => {
    const { user } = useAuth();
    const { data: todos, isLoading, error } = useTodos();
    const createTodoMutation = useCreateTodo();
    const updateTodoMutation = useUpdateTodo();
    const deleteTodoMutation = useDeleteTodo();

    const [isCreating, setIsCreating] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [newTodo, setNewTodo] = useState<CreateTodoRequest>({ title: '', description: '', completed: false });
    const [editTodo, setEditTodo] = useState<UpdateTodoRequest>({ title: '', description: '', completed: false });

    const handleCreateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.title.trim()) return;

        try {
            await createTodoMutation.mutateAsync(newTodo);
            setNewTodo({ title: '', description: '', completed: false });
            setIsCreating(false);
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    };

    const handleUpdateTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTodo || !editTodo.title?.trim()) return;

        try {
            await updateTodoMutation.mutateAsync({ id: editingTodo.id, todo: editTodo });
            setEditingTodo(null);
            setEditTodo({ title: '', description: '', completed: false });
        } catch (error) {
            console.error('Failed to update todo:', error);
        }
    };

    const handleToggleComplete = async (todo: Todo) => {
        try {
            await updateTodoMutation.mutateAsync({
                id: todo.id,
                todo: { completed: !todo.completed }
            });
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const handleDeleteTodo = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this todo?')) return;

        try {
            await deleteTodoMutation.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    const startEditing = (todo: Todo) => {
        setEditingTodo(todo);
        setEditTodo({ title: todo.title, description: todo.description, completed: todo.completed });
    };

    const canDelete = user?.role === 'admin';

    if (isLoading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Todos</h2>
                <div className="text-center">Loading todos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Todos</h2>
                <div className="text-red-600">Error loading todos</div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Todos</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                    Add Todo
                </button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreateTodo} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Todo title"
                            value={newTodo.title}
                            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            placeholder="Todo description"
                            value={newTodo.description}
                            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            rows={2}
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            disabled={createTodoMutation.isPending}
                            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                            {createTodoMutation.isPending ? 'Creating...' : 'Create'}
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

            <div className="space-y-3">
                {todos?.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        No todos yet. Create your first todo!
                    </div>
                ) : (
                    todos?.map((todo) => (
                        <div key={todo.id} className={`border rounded-lg p-4 ${todo.completed ? 'bg-gray-50' : ''}`}>
                            {editingTodo?.id === todo.id ? (
                                <form onSubmit={handleUpdateTodo}>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            value={editTodo.title}
                                            onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <textarea
                                            value={editTodo.description}
                                            onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={editTodo.completed}
                                                onChange={(e) => setEditTodo({ ...editTodo, completed: e.target.checked })}
                                                className="mr-2"
                                            />
                                            Completed
                                        </label>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            disabled={updateTodoMutation.isPending}
                                            className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {updateTodoMutation.isPending ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingTodo(null)}
                                            className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center flex-1">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => handleToggleComplete(todo)}
                                                className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                    {todo.title}
                                                </h3>
                                                {todo.description && (
                                                    <p className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                                        {todo.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            {(user?.id === todo.created_by || user?.role === 'admin') && (
                                                <button
                                                    onClick={() => startEditing(todo)}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                    disabled={deleteTodoMutation.isPending}
                                                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Created: {new Date(todo.created_at).toLocaleDateString()}
                                        {todo.completed && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Completed
                                            </span>
                                        )}
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

export default TodosSection;
