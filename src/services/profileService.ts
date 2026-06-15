import type { User } from '@/types/user'

// Функция расчета ИМТ для любого переданного пользователя
export function calculateBmi(user: User | null): string | null {
    if (!user || !user.userWeight || !user.userHeight) {
        return null
    }
    const heightInMeters = user.userHeight / 100
    const bmiValue = user.userWeight / (heightInMeters ** 2)
    return bmiValue.toFixed(2)
}

// Функция расчета оставшегося веса с учетом цели
export function calculateWeightLeft(user: User | null): string | null {
    if (!user || user.userWeight == null || user.goalWeight == null) {
        return null
    }

    // Если цель — поддержание веса, то худеть или набирать не нужно (UX фишка)
    if (user.goal === 'weightMaintenance') {
        return '0.00'
    }

    // Набор массы: цель минус текущий
    if (user.goal === 'bodyBuild') {
        const diff = user.goalWeight - user.userWeight
        return diff > 0 ? diff.toFixed(2) : '0.00'
    }

    // Сброс веса (fit): текущий минус цель
    const diff = user.userWeight - user.goalWeight
    return diff > 0 ? diff.toFixed(2) : '0.00'
}

export function bmiToString(bmi: number): string {
    if (bmi < 16) return 'Значительный дефицит массы тела'
    if (bmi < 18.5) return 'Дефицит массы тела'
    if (bmi < 25) return 'Норма'
    if (bmi < 30) return 'Лишний вес'
    if (bmi < 35) return 'Ожирение 1 степени'
    if (bmi < 40) return 'Ожирение 2 степени'
    return 'Ожирение 3 степени'
}

export function goalToString(goal: string | undefined): string {
    if (goal === 'fit') return 'Сброс веса'
    if (goal === 'weightMaintenance') return 'Поддержание веса'
    if (goal === 'bodyBuild') return 'Набор мышечной массы'
    return 'Не указана'
}

export function activityToSting(activity: string | undefined): string {
    switch (activity) {
        case 'passive': return 'Сидячий образ жизни'
        case 'low': return 'Тренировки 1-3 раза в неделю'
        case 'medium': return 'Тренировки 3-5 раз в неделю'
        case 'high': return 'Тренировки 5-6 раз в неделю'
        case 'ultra': return 'Постоянная физическая нагрузка'
        default: return 'Не указана'
    }
}