import { useAuthStore } from "@/stores/authstore"
import { computed, ref } from "vue"

export const startWeight = ref(0)
export const userCurrentWeight = ref(0)

export const ciloPercentLoss = computed(() => {
    const auth = useAuthStore()
    const startUserWeight = startWeight.value
    const currentWeight = userCurrentWeight.value
    const goalWeight = auth.user?.goalWeight ?? 0

    const percent = ((startUserWeight - currentWeight) / (startUserWeight - goalWeight)) * 100

    return percent > 0 ? percent : 0
})

export const ciloPercentPross = computed(() => {
    const auth = useAuthStore()
    const startUserWeight = startWeight.value
    const currentWeight = userCurrentWeight.value
    const goalWeight = auth.user?.goalWeight ?? 0

    const percent = ((currentWeight - startUserWeight) / (goalWeight - startUserWeight)) * 100

    console.log('PROSS', percent)
    return percent > 0 ? percent : 0
})