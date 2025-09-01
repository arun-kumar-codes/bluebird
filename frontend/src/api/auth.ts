import { apiClient } from './client';
import { LoginRequest, SignupRequest, Token, User } from '../types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<Token> => {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await apiClient.post<Token>('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    signup: async (userData: SignupRequest): Promise<User> => {
        const response = await apiClient.post<User>('/auth/signup', userData);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },
};
