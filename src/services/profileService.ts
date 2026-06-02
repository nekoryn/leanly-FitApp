import { computed } from 'vue'
import { useAuthStore } from '@/stores/authstore'

export const bmi = computed(() => {
    const auth = useAuthStore()
    if (!auth.user) {
        return null
    }
    return (
        auth.user.userWeight / ((auth.user.userHeight) / 100) ** 2
    ).toFixed(2)
})

export const weightLeft = computed(() => {
    const auth = useAuthStore()
    if (!auth.user || auth.user.goalWeight == null) {
        return null
    }
    if (auth.user.goal === 'bodyBuild') {
        return (auth.user.goalWeight - auth.user.userWeight).toFixed(2);
    }
    return (auth.user.userWeight - auth.user.goalWeight).toFixed(2);
})

export function bmiToString(bmi: number) {
    if (bmi < 16) {
        return 'Значительный дефицит массы тела'
    }
    if (bmi >= 16 && bmi < 18.5) {
        return 'Дефицит массы тела'
    }
    if (bmi >= 18.5 && bmi < 25) {
        return 'Норма'
    }
    if (bmi >= 25 && bmi < 30) {
        return 'Лишний вес'
    }
    if (bmi >= 30 && bmi < 35) {
        return 'Ожирение 1 степени'
    }
    if (bmi >= 35 && bmi < 40) {
        return 'Ожирение 2 степени'
    }

    return 'Ожирение 3 степени'
}

export function goalToString(goal: string) {
    if (goal === 'fit') {
        return 'Сброс веса'
    }
    if (goal === 'weightMaintenance') {
        return "Поддержание веса"
    }
    if (goal === 'bodyBuild') {
        return "Набор мышечной массы"
    }
}

export function activityToSting(activity: string) {
    if (activity === 'passive') {
        return 'Сидячий образ жизни'
    }
    if (activity === 'low') {
        return 'Тренировки 1-3 раза в неделю'
    }
    if (activity === 'medium') {
        return 'Тренировки 3-5 раз в неделю'
    }
    if (activity === 'high') {
        return 'Тренировки 5-6 раз в неделю'
    }
    if (activity === 'ultra') {
        return 'Постоянная физическая нагрузка'
    }
}