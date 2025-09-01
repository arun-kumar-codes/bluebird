import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../api/auth';

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const userData = await authApi.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        // Fetch user data after setting token
        authApi.getCurrentUser().then(userData => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
