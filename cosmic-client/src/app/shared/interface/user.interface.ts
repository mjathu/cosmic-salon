export interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    active: boolean;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: 'admin' | 'client' | 'staff';
    phone: string;
    emailVerifiedAt: string;
    rememberToken: string;
}