import type { AuthPayload } from '@/types/authPayload';
import { useAuthStore } from '@/stores/authstore';
import { ref } from 'vue';    
import type { ValidationIssue } from '@/types/validationIssues';



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const authErrors = ref<Record<string, string>>({})   


export const submitAuth = async (payload: AuthPayload) => {
    try {
        const auth = useAuthStore()
        const res = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(payload),
        }) 
    
        const data = await res.json();
    
        console.log(data.token)
    
        if (data.token) {
            auth.setToken(data.token)
        }

        if (res.status === 422) {
            data.issues.forEach((issue: ValidationIssue) => {
                authErrors.value[String(issue.field)] = issue.message
            })
        }

        if (res.status === 401) {
            authErrors.value['password'] = 'Неверный пароль'
        }

        if (res.status === 404) {
            authErrors.value['email'] = 'Пользователь с таким email не найден'
        }

    } catch (err) {
        console.log('Error during authentication:', err)
    }
} 