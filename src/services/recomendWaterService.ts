import { computed } from 'vue';
import { useAuthStore } from '@/stores/authstore';
import { userCurrentWeight } from './ciloPercentService';

export const waterTarget = computed(() => {
    const auth = useAuthStore();
    let calculatedTarget = 0;
    const currentWeight = userCurrentWeight.value || auth.user?.userStartWeight || 70;
    if (auth.user?.gender === 'male') {
        calculatedTarget = currentWeight * 35;
    } else {
        calculatedTarget = currentWeight * 30
    }
    return Math.round(calculatedTarget / 50) * 50;
});