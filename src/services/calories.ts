import { computed } from 'vue'
import { useAuthStore } from '@/stores/authstore'

const bmr = computed(() => {
    const auth = useAuthStore()
    const user = auth.user
    if (!user) {
        return 0
    }

    const weight = Number(user.userWeight)
    const height = Number(user.userHeight)
    const age = Number(user.userAge)

    if (user.gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161
    }
})

const tdee = computed(() => {
    const auth = useAuthStore()
    const user = auth.user
    if (!user) {
        return 0
    }

    const bmrValue = bmr.value

    const multipliers: Record<string, number> = {
        passive: 1.2,
        low: 1.375,
        medium: 1.55,
        high: 1.725,
        ultra: 1.9,
    }

    return bmrValue * (multipliers[user.activity] || 1.2)
})

export function targetCalories(goal: string | undefined) {
    const base = tdee.value

    switch (goal) {
        case 'fit':
            return base * 0.85
        case 'weightMaintenance':
            return base
        case 'bodyBuild':
            return base + 300
        default:
            return base
    }
}