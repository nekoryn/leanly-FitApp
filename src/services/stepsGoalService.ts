import { computed } from 'vue';
import { useAuthStore } from '@/stores/authstore';

export const stepsTarget = computed(() => {
    const auth = useAuthStore();

    const averageStepsString = auth.user?.avg_steps || ''; 

    const targetMap: Record<string, number> = {
        'under_2k': 1500,
        '2k-5k': 3500,
        '5k-7.5k': 6000,
        '7.5k-10k': 8500,
        '10k-15k': 12500,
        '15k-20k': 17500,
        '20k+': 22500
    };


    return targetMap[averageStepsString] || 10000;
});