import { useAuthStore } from '@/stores/authstore'
import { ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const currentWeight = ref('')
export const weightIssueMessage = ref('')

export async function fetchWeightHistory() {
    const auth = useAuthStore()
    const res = await fetch(`${API_BASE_URL}/weight-history`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        }
    })

    if (!res.ok) {
        console.log('Failed to fetch weight history')
        return
    }

    const data = await res.json()
    return data
}

export async function submitWeight(currentWeight: number) {
    try {
        const auth = useAuthStore()
        const res = await fetch(`${API_BASE_URL}/weight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
    
            body: JSON.stringify({
                weight: currentWeight
            })
        })
    
        const data = await res.json()
    
        if (auth.user) {
            auth.user.userWeight = Number(currentWeight)
        }

        if (res.status === 422) {
            weightIssueMessage.value = await data.issues[0].message
            throw new Error('Type error')
        }
        
        await fetchWeightHistory()
    } catch (err) {
        console.log("ERROR", err)
    }
}