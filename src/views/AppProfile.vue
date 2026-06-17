<script setup lang="ts">
import DefaultLayout from '@/layout/DefaultLayout.vue';
import { useAuthStore } from '@/stores/authstore';
import { useRoute, useRouter } from 'vue-router';
import { calculateBmi, calculateWeightLeft, bmiToString, goalToString, activityToSting } from '@/services/profileService.ts';
import { useToast } from 'vue-toastification'
import RedButton from '@/components/ui/RedButton.vue';
import { computed, ref, watch } from 'vue';
import { getUserProfile } from '@/api/usersApi';
import type { User } from '@/types/user';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL;

const isLoading = ref(true);
const targetUser = ref<User>(); 

const isMyProfile = computed(() => {
    const paramUid = route.params.uid;
    return !paramUid || String(paramUid) === String(auth.user?.uid);
});

const displayUser = computed(() => {
    return isMyProfile.value ? auth.user : targetUser.value;
});

const avatarUrl = computed(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ? true : false;
    const avatar = displayUser.value?.user_avatar;
    
    if (!avatar || avatar === ' ') {
        return isDark
            ? `${AVATAR_BASE_URL}/uploads/avatars/dark_default_avatar.webp`
            : `${AVATAR_BASE_URL}/uploads/avatars/default_avatar.webp`;
    }
    return `${AVATAR_BASE_URL}/uploads/avatars/${avatar}`;
});

const loadProfileData = async () => {
    isLoading.value = true;
    
    if (isMyProfile.value) {
        isLoading.value = false;
        return;
    }

    try {
        const userId = String(route.params.uid);
        
        const data = await getUserProfile(userId); 
        console.log(data)
        targetUser.value = data;
        
        isLoading.value = false;
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить профиль';
        toast.error(errorMessage);
        router.push('/recepies');
    }
};


watch(() => route.params.uid, () => {
    loadProfileData();
}, { immediate: true });

function logoutClicked() {
    auth.logOut();
    toast.success('Вы вышли из аккаунта');
    router.push('/auth');
}
</script>

<template>
    <DefaultLayout>
        <div v-if="isLoading" class="flex justify-center items-center min-h-100 text-xl dark:text-[#c9cbd0]">
            <p>Загрузка профиля...</p> 
        </div>

        <section v-else-if="displayUser" class="flex items-stretch">
            <div class="bg-[#419400] dark:bg-[#3abdf7] w-30 rounded-l-xl hidden lg:block"></div>
            
            <div class="bg-[#f8fdef] flex flex-col items-center justify-center w-full dark:bg-[#0a1120] rounded-xl p-4 transition-colors duration-100 md:w-3xl md:p-7 lg:w-222 lg:rounded-l-none">
                
                <img :src="avatarUrl" alt="аватарка" class="rounded-[200px] w-40 md:w-50 lg:w-60 my-4 object-cover">
                
                <p class="dark:text-[#c9cbd0] w-fit text-2xl font-bold md:text-3xl">{{ displayUser.nickname }}</p>
                
                <div class="mt-2 mb-4 w-full flex flex-1 flex-col gap-4 md:flex-row">
                    <div v-if="isMyProfile" class="flex flex-col justify-center dark:text-[#c9cbd0] bg-[#e1e6d9] dark:bg-[#0c1425] p-4 rounded-xl md:w-90 transition-colors duration-100">
                        <h2 class="text-xl dark:text-[#c9cbd0] font-bold md:text-2xl">Текущие показатели</h2>
                        <p class="md:text-xl">Вес: {{ displayUser.userWeight }} Кг Рост: {{ displayUser.userHeight }} См</p>
                        
                        <p class="md:text-xl">ИМТ: {{ calculateBmi(displayUser) }} - {{ calculateBmi(displayUser) ? bmiToString(Number(calculateBmi(displayUser))) : '' }}</p>
                    </div>
                    
                    <div class="dark:text-[#c9cbd0] flex flex-col flex-1 bg-[#e1e6d9] dark:bg-[#0c1425] p-4 rounded-xl transition-colors duration-100">
                        <h2 class="text-xl dark:text-[#c9cbd0] font-bold md:text-2xl">Общая информация</h2>
                        <p class="md:text-xl">Пол: {{ displayUser.gender === 'male' ? 'Мужской' : 'Женский' }}</p>
                        <p class="md:text-xl">Возраст: {{ displayUser.userAge }} Лет</p>
                        <p class="md:text-xl">Цель: {{ goalToString(displayUser.goal) }}</p>
                        <p class="md:text-xl">Активность: {{ activityToSting(displayUser.activity) }}</p>
                    </div>
                </div>
                
                <div v-if="isMyProfile" class="dark:text-[#c9cbd0] w-full bg-[#e1e6d9] dark:bg-[#0c1425] p-4 rounded-xl mb-2 transition-colors duration-100">
                    <p class="md:text-xl">До желаемого веса осталось: {{ calculateWeightLeft(displayUser) ?? '' }} Кг</p>
                </div>

                <RedButton v-if="isMyProfile" class="mt-2" @click="logoutClicked">Выйти</RedButton>
            </div>
        </section>
    </DefaultLayout>
</template>