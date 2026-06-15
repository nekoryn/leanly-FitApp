import type { User } from '@/types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function getUserProfile(uid: string): Promise<User> {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/user-profile/${uid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        }
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Не удалось загрузить профиль пользователя');
    }

    const data = await res.json()
    
    return data[0]
}