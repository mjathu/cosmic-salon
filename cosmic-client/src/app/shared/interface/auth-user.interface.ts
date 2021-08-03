
export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    active: boolean;
    email: string;
    phone: string;
    token?: string;
    createdAt: string;
    updatedAt: string;
    role: 'admin' | 'client' | 'staff';
    rememberToken: string;
}