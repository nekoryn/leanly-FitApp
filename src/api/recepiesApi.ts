import { useAuthStore } from "@/stores/authstore"
import { useRecepieStore } from "@/stores/recepieStore"
import type { ValidationIssue } from "@/types/validationIssues"
import { ref } from "vue"
import { useToast } from "vue-toastification"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const toast = useToast()

export const recepieErrors = ref<Record<string, string>>({})


export const createRecepie = async () => {
    try {
        recepieErrors.value = {}


        const recepie = useRecepieStore()
        const auth = useAuthStore()

        const formData = new FormData()

        formData.append('title', recepie.title)
        if (recepie.recepie_image) {
            formData.append('recepie_image', recepie.recepie_image)
        }

        formData.append('description', recepie.description)
        formData.append('ingredients', recepie.ingredients)
        formData.append('main_text', recepie.main_text)

        formData.append('proteins', recepie.proteins)
        formData.append('fats', recepie.fats)
        formData.append('carbs', recepie.carbs)
        formData.append('calories', recepie.calories)

        const res = await fetch(`${API_BASE_URL}/recepies/add`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            body: formData
        })

        const data = await res.json()
        
        if (res.status === 500) {
            throw new Error('Ошибка! Не удалось обновить данные.')
        }

        if (res.status === 422) {
            data.issues.forEach((issue: ValidationIssue) => {
                recepieErrors.value[String(issue.field)] = issue.message
            })
            throw new Error('Ошибка! Не удалось обновить данные.')
        }
        
        toast.success(data.message)
        recepie.resetForm()
    } catch (err) {
        throw err
    }
}


export const loadRecepies = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/recepies`, {
            method: 'GET'
        })
        
        if (res.status === 404) {
            throw new Error('Рецепты не найдены')
        }

        if (res.status === 500) {
            throw new Error('Внутренняя ошибка сервера, попробуйте позже')
        }

        const data = await res.json()
        return data
    } catch (err) {
        throw err
    }
}

export const deleteRecipe = async (rid: number) => {
    const auth = useAuthStore()
    try {
        const res = await fetch(`${API_BASE_URL}/recepies/delete/${rid}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })

        const data = await res.json

        return data
    } catch (err) {
        throw err
    }
}

export const updateRecipes = async (rid: number) => {
    const auth = useAuthStore()
    const recepie = useRecepieStore()
    
    const formData = new FormData()

    formData.append('title', recepie.title)

    if (recepie.recepie_image) {
        formData.append('recepie_image', recepie.recepie_image)
    }

    formData.append('description', recepie.description)
    formData.append('ingredients', recepie.ingredients)
    formData.append('main_text', recepie.main_text)

    formData.append('proteins', recepie.proteins)
    formData.append('fats', recepie.fats)
    formData.append('carbs', recepie.carbs)
    formData.append('calories', recepie.calories)

    try {
        const res = await fetch(`${API_BASE_URL}/recepies/edit/${rid}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            body: formData
        })

        const data = await res.json()
        
        if (res.status === 500) {
            throw new Error('Ошибка! Не удалось обновить данные.')
        }

        if (res.status === 422) {
            data.issues.forEach((issue: ValidationIssue) => {
                recepieErrors.value[String(issue.field)] = issue.message
            })
            throw new Error('Ошибка! Не удалось обновить данные.')
        }
        recepie.resetForm()
    } catch (err) {
        throw err
    }
}