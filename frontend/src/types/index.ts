export interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'member';
    is_active: boolean;
    organization_id?: number;
    created_at: string;
    updated_at?: string;
}

export interface Organization {
    id: number;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface Note {
    id: number;
    title: string;
    content?: string;
    organization_id: number;
    created_by: number;
    created_at: string;
    updated_at?: string;
}

export interface Todo {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    organization_id: number;
    created_by: number;
    created_at: string;
    updated_at?: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    organization_id?: number;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface CreateNoteRequest {
    title: string;
    content?: string;
}

export interface UpdateNoteRequest {
    title?: string;
    content?: string;
}

export interface CreateTodoRequest {
    title: string;
    description?: string;
    completed?: boolean;
}

export interface UpdateTodoRequest {
    title?: string;
    description?: string;
    completed?: boolean;
}
