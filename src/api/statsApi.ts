import { useAuthStore } from "@/stores/authstore"
import type { saveStatsPayload } from "@/types/saveStatsPayload"
import type { ValidationIssue } from "@/types/validationIssues"
import { ref } from "vue"

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const isTodayStatsExist = ref(false)    
export const statsErrors = ref<Record<string, string>>({})

export async function loadStats(selectedDate: string) {
    const auth = useAuthStore()
    const res = await fetch(`${VITE_API_BASE_URL}/daily-stats/${selectedDate}`, {
        headers: {
            Authorization: `Bearer ${auth.token}`
        }
    })

    if (!res.ok) {
        isTodayStatsExist.value = false
        return null
    }

    isTodayStatsExist.value = true
    return await res.json()
}

export async function saveStats(payload: saveStatsPayload) {
    try {
        const auth = useAuthStore()
        const res = await fetch(`${VITE_API_BASE_URL}/daily-stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            statsErrors.value = {}
            console.log(data.issues)

            data.issues.forEach((issue: ValidationIssue) => {
                statsErrors.value[String(issue.field)] = issue.message
            })

            console.log(statsErrors.value)

            throw new Error('Stats error!')
        }

    } catch (err) {
        console.log(err)
    }
}