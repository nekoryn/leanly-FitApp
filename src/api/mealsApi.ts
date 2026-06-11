import { useAuthStore } from '@/stores/authstore'
import type { CreateMealPlayload } from '@/types/createMealType'
import type { ValidationIssue } from '@/types/validationIssues';
import { ref } from 'vue'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


export const isMealsExist = ref(false);
export const mealsErrors = ref<Record<string, string>>({})

export const summaryMeal = ref({
    totalCalories: 0,
    totalProteins: 0,
    totalFats: 0,
    totalCarbs: 0,
})

export async function submitMeal(payload: CreateMealPlayload, selectedDate: string) {
    const auth = useAuthStore()
    const res = await fetch(`${API_BASE_URL}/meals/${selectedDate}`, { 
        method: 'POST', 
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}` 
        },
        body: JSON.stringify(payload)
    })
    
    const data = await res.json()

    if (!res.ok) {
        data.issues.forEach((issue: ValidationIssue) => {
            mealsErrors.value[String(issue.field)] = issue.message
        });

        throw mealsErrors.value
    }
}

export async function loadMeals(selectedDate: string) {
    try {
        const auth = useAuthStore()
        const response = await fetch(`${API_BASE_URL}/meals/${selectedDate}`, { 
            method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}` 
            }
        })

        if (!response.ok) {
            isMealsExist.value = false
            return null
        }

        const meals = await response.json()
        isMealsExist.value = meals && meals.length > 0
        return meals
    } catch (err) {
        console.log('Error loading meals:', err)
        isMealsExist.value = false
        return null
    }
}

export async function loadSummaryMeal(selectedDate: string) {
    try {
        const auth = useAuthStore()
        const res = await fetch(`${API_BASE_URL}/meals/${selectedDate}/summary`, { 
        method: 'GET', 
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}` 
        }
        })

        if (!res.ok) {
            return null
        }

        const summary = await res.json()
        return summary[0]
    } catch (err) {
        console.log('Error loading meals summary:', err)
        return null
    }
}