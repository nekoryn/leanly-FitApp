<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { computed } from 'vue';
import { registerErrors } from '@/api/registerApi/registerFinallApi';

const step1HasError = computed(() => {
    return !!(
        registerErrors.value.nickname ||
        registerErrors.value.email ||
        registerErrors.value.password
    )
})

const step2HasError = computed(() => {
    return !!(
        registerErrors.value.userWeight ||
        registerErrors.value.userAge ||
        registerErrors.value.userHeight ||
        registerErrors.value.gender
    )
})

const step3HasError = computed(() => {
    return !!(
        registerErrors.value.goal || 
        registerErrors.value.activity ||
        registerErrors.value.goalWeight
    )
})

</script>

<template>
    <div class="self-center flex gap-2 p-2 rounded-2xl items-center bg-[#cbcfc3] dark:bg-[#0f172a] md:p-4 md:rounded-4xl">
        <RouterLink to="/register/step-1" class="flex w-8 h-8 md:w-10 md:h-10 dark:text-white dark:hover:bg-[#3abdf7] dark:active:bg-[#818cf8] hover:bg-[#edd000] hover:shadow-[0_0_20px_#edd000] dark:hover:shadow-[0_0_20px_#3abdf7] active:shadow-[0_0_20px_#419400] dark:active:shadow-[0_0_20px_#818cf8] active:bg-[#419400] duration-100 rounded-3xl items-center justify-center md:text-xl"
        :class="step1HasError ? 'bg-[#efc6c2] shadow-[0_0_20px_#efc6c2] dark:shadow-[0_0_20px_#fb7085] dark:bg-[#fb7085]' : 'bg-[#f8fdef] dark:bg-[#0a1120]'">
            1
        </RouterLink>
        <RouterLink to="/register/step-2" class="flex w-8 h-8 md:w-10 md:h-10 dark:text-white dark:hover:bg-[#3abdf7] dark:active:bg-[#818cf8] hover:bg-[#edd000] hover:shadow-[0_0_20px_#edd000] dark:hover:shadow-[0_0_20px_#3abdf7] active:shadow-[0_0_20px_#419400] dark:active:shadow-[0_0_20px_#818cf8] active:bg-[#419400] duration-100 rounded-3xl items-center justify-center md:text-xl"
        :class="step2HasError ? 'bg-[#efc6c2] dark:bg-[#fb7085]' : 'bg-[#f8fdef] dark:bg-[#0a1120]'">
            2
        </RouterLink>
        <RouterLink to="/register/step-3" class="flex w-8 h-8 md:w-10 md:h-10 dark:text-white dark:hover:bg-[#3abdf7] dark:active:bg-[#818cf8] hover:bg-[#edd000] hover:shadow-[0_0_20px_#edd000] dark:hover:shadow-[0_0_20px_#3abdf7] active:shadow-[0_0_20px_#419400] dark:active:shadow-[0_0_20px_#818cf8] active:bg-[#419400] duration-100 rounded-3xl items-center justify-center md:*:text-xl"
        :class="step3HasError ? 'bg-[#efc6c2] dark:bg-[#fb7085]' : 'bg-[#f8fdef] dark:bg-[#0a1120]'">
            3
        </RouterLink>
        <RouterLink to="/register/step-4" class="flex w-8 h-8 md:w-10 md:h-10 dark:text-white dark:hover:bg-[#3abdf7] dark:active:bg-[#818cf8] hover:bg-[#edd000] hover:shadow-[0_0_20px_#edd000] dark:hover:shadow-[0_0_20px_#3abdf7] active:shadow-[0_0_20px_#419400] dark:active:shadow-[0_0_20px_#818cf8] active:bg-[#419400] duration-100 rounded-3xl items-center justify-center md:*:text-xl"
        :class="step3HasError ? 'bg-[#efc6c2] dark:bg-[#fb7085]' : 'bg-[#f8fdef] dark:bg-[#0a1120]'">
            4
        </RouterLink>
    </div>
</template>