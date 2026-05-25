<script setup lang="ts">
import DefaultLink from '@/components/ui/DefaultLink.vue';
import FormHeader from '@/components/ui/FormHeader.vue';
import FormInput from '@/components/ui/FormInput.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RegLayout from '@/layout/RegLayout.vue';
import { useAuthStore } from '@/stores/authstore';
import { ref } from 'vue'; 
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();


const submitAuth = async () => {

    const auth = useAuthStore()
    const res = await fetch('http://193.233.133.68/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    }) 

    const data = await res.json();

    console.log(data.token)

    if (data.token) {
        auth.setToken(data.token)
    }

    await router.push('/profile');
} 

</script>

<template>
    <RegLayout>
        <FormHeader>
            Авторизация
        </FormHeader>
        <form @submit.prevent="submitAuth" class="w-full flex mt-4 flex-col gap-3 items-center justify-center">
            <FormInput v-model="email" name="email" id="email" placeholder="Введите email" type="email">
                Email
            </FormInput>

            <FormInput v-model="password" name="password" id="password" placeholder="Введите пароль" type="password">
                Пароль
            </FormInput>
            
            <div class="flex gap-2">
                <p class="dark:text-[#c9cbd0]">Еще нет аккаунта?</p>
                <DefaultLink to="/register/step-1">Создать</DefaultLink>
            </div>
            <NextStepBtn>
                Войти
            </NextStepBtn>
        </form>
    </RegLayout>
</template>