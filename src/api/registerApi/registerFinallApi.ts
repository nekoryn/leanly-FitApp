import { useRegisterStore } from '@/stores/register';
import { ref } from 'vue';
import type { ValidationIssue } from '@/types/validationIssues.ts';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const registerErrors = ref<Record<string, string>>({})   


export const submitReg = async () => {
    try {
        const register = useRegisterStore();
        const payload = {
            ...register.$state,
            userWeight: Number(register.userWeight),
            userHeight: Number(register.userHeight),
            userAge: Number(register.userAge),
            goalWeight: Number(register.goalWeight),
        }
        const res = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        const data = await res.json()
    
        if (res.status === 422) {
            data.issues.forEach((issue: ValidationIssue) => {
                registerErrors.value[String(issue.field)] = issue.message
            })
            throw new Error(data.message)
        }

        if (res.status === 400) {
            registerErrors.value['email'] = 'Пользователь с таким email уже существует!'
            throw new Error(data.message)
        }

        return data.message
    } catch (err) {
        return 'error'
    }
}