import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import NotesSection from './NotesSection';
import TodosSection from './TodosSection';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">Bulebird</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">
                                Welcome, {user?.username}
                                {user?.role === 'admin' && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Admin
                                    </span>
                                )}
                            </span>
                            <button
                                onClick={logout}
                                className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <NotesSection />
                        <TodosSection />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
