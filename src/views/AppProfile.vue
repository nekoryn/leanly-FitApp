<script setup lang="ts">
    import DefaultLayout from '@/layout/DefaultLayout.vue';
    import { useAuthStore } from '@/stores/authstore';
    import { useRouter } from 'vue-router';
    import { bmi, weightLeft, bmiToString, goalToString, activityToSting } from '@/services/profileService.ts';
    import { useToast } from 'vue-toastification'
    import RedButton from '@/components/ui/RedButton.vue';

    
    const router = useRouter()
    const auth = useAuthStore()
    const toast = useToast()


    function logoutClicked() {
        auth.logOut()
        toast.success('Вы вышли из аккаунта')
        router.push('/auth')
    }

</script>

<template>
    <DefaultLayout>
        <section class="flex items-stretch">
            <div class="bg-[#419400] dark:bg-[#3abdf7] w-30 rounded-l-xl hidden lg:block">
    
            </div>
            <div class="bg-[#f8fdef] flex flex-col items-center justify-center w-full dark:bg-[#0a1120] rounded-xl p-4 transition-colors duration-100 md:w-3xl md:p-7 lg:w-220 lg:rounded-l-none">
                <p class="dark:text-[#c9cbd0] w-fit text-2xl font-bold md:text-3xl">{{ auth.user?.nickname }}</p>
                <div class="mt-2 mb-4 w-full flex flex-1 flex-col gap-4 md:flex-row">
                    <div class="flex flex-col justify-center dark:text-[#c9cbd0] bg-[#e1e6d9] dark:bg-[#0c1425] p-4 rounded-xl md:w-90 transition-colors duration-100">
                        <h2 class="text-xl dark:text-[#c9cbd0] font-bold md:text-2xl">Текущие показатели</h2>
                        <p class="md:text-xl">Вес: {{ auth.user?.userWeight }} Кг Рост: {{ auth.user?.userHeight }} См</p>
                        <p class="md:text-xl">ИМТ: {{ bmi }} - {{ bmi? bmiToString(Number(bmi)) : '' }}</p>
                    </div>
                    <div class="dark:text-[#c9cbd0] flex flex-col flex-1 bg-[#e1e6d9] dark:bg-[#0c1425] p-4 rounded-xl transition-colors duration-100">
                        <h2 class="text-xl dark:text-[#c9cbd0] font-bold md:text-2xl">Общая информация</h2>
                        <p class="md:text-xl">Пол: {{ auth.user?.gender === 'male' ? 'Мужской' : 'Женский' }}</p>
                        <p class="md:text-xl">Возраст: {{ auth.user?.userAge }} Лет</p>
                        <p class="md:text-xl">Цель: {{ auth.user ? goalToString(auth.user?.goal) : '' }}</p>
                        <p class="md:text-xl">Активность: {{ auth.user ? activityToSting(auth.user?.activity) : '' }}</p>
                    </div>
                </div>
                <div class="dark:text-[#c9cbd0] w-full bg-[#e1e6d9] dark:bg-[#0c1425] p-4 rounded-xl mb-2 transition-colors duration-100">
                    <p class="md:text-xl">До желаемого веса осталось: {{ weightLeft ?? '' }} Кг</p>
                </div>
                
                <RedButton class="mt-2" @click="logoutClicked">Выйти</RedButton>
            </div>
        </section>
    </DefaultLayout>
</template>