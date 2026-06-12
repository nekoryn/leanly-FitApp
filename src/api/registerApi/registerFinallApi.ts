import { useRegisterStore } from '@/stores/register';
import { ref } from 'vue';
import type { ValidationIssue } from '@/types/validationIssues.ts';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const registerErrors = ref<Record<string, string>>({})   


export const submitReg = async () => {
    const register = useRegisterStore();

    const formData = new FormData()

    formData.append('nickname', register.nickname);
    formData.append('email', register.email);
    formData.append('password', register.password);
    formData.append('gender', register.gender);
    formData.append('activity', register.activity);
    formData.append('goal', register.goal);

    formData.append('userWeight', String(Number(register.userWeight)));
    formData.append('userHeight', String(Number(register.userHeight)));
    formData.append('userAge', String(Number(register.userAge)));
    formData.append('goalWeight', String(Number(register.goalWeight)));

    if (register.avatar) {
        formData.append('avatar', register.avatar);
    }

    const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: formData
    })

    const data = await res.json()

    if (res.status === 422) {
        data.issues.forEach((issue: ValidationIssue) => {
            registerErrors.value[String(issue.field)] = issue.message
        })
        throw new Error(data.message)
    }

    if (data.field === 'email' && res.status === 400) {
        registerErrors.value['email'] = 'Пользователь с таким email уже существует!'
        throw new Error(data.message)
    }

    if (data.field === 'nickname' && res.status === 400) {
        registerErrors.value['nickname'] = 'Пользователь с таким nickname уже существует!'
        throw new Error(data.message)
    }

    if (res.status === 500) {
        throw new Error(data.message)
    }

    return data.message

}