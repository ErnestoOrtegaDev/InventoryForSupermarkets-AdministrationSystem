// src/types/index.ts

// USER (Based on UserSchema)
export interface User {
    _id: string;
    firstName: string;       // Replaced 'name' with separate first and last name fields
    lastName: string;
    email: string;
    role: 'admin' | 'worker' | 'provider' | 'manager'; // Exact roles defined in the Backend
    supermarket?: string | { _id: string; name: string };
    status: boolean;         
    googleId?: string;
    image?: string;          
}

// SUPERMARKET (Based on SupermarketSchema)
export interface Supermarket {
    _id: string;
    name: string;
    address: string;
    phone?: string;          // Optional field as defined in the model
    image?: string;          // Optional field (default: 'default-store.jpg')
    active: boolean;
    createdBy?: string;      // ID of the user who created the record
}

// PRODUCT (Based on ProductSchema)
export interface Product {
    _id: string;
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
    minStock: number;
    image?: string;          
    category?: string;       
    supermarket: string;     // Reference to the Supermarket ID
    active: boolean;
    
    alert?: boolean;         
    alertMessage?: string;
}

// NOTIFICATION (Based on NotificationSchema)
export interface Notification {
    _id: string;
    type: 'STOCK_ALERT' | 'SYSTEM_MSG';
    message: string;
    supermarket: string;
    product?: Product | string; // Can be a populated object or just the ID string
    read: boolean;
    createdAt: string;       // ISO Date strings as they travel via JSON
}

// LOGIN RESPONSE
export interface LoginResponse {
    message: string;
    user: User;
}