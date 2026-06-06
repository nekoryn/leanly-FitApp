<script setup lang="ts">
import { submitAuth } from '@/api/authApi';
import DefaultLink from '@/components/ui/DefaultLink.vue';
import FormHeader from '@/components/ui/FormHeader.vue';
import FormInput from '@/components/ui/FormInput.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RegLayout from '@/layout/RegLayout.vue';
import { ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { authErrors } from '@/api/authApi.ts';


const email = ref('');
const password = ref('');
const router = useRouter()

async function handleSubmitAuth() {
    await submitAuth({
        email: email.value,
        password: password.value,
    })

    router.push('/profile');
}

</script>

<template>
    <RegLayout>
        <FormHeader>
            Авторизация
        </FormHeader>
        <form @submit.prevent="handleSubmitAuth" class="w-full flex mt-4 flex-col gap-3 justify-center">
            <div>
                <FormInput v-model="email" name="email" id="email" placeholder="Введите email" type="email" @validation="authErrors.email = $event">
                    <template #inputLabel>
                        email
                    </template>

                    <template #inputError v-if="authErrors.email">
                        {{ authErrors.email }}
                    </template>
                </FormInput>
            </div>

            <div>
                <FormInput v-model="password" name="password" id="password" placeholder="Введите пароль" type="password" @validation="authErrors.password = $event">
                    <template #inputLabel>
                        Пароль
                    </template>

                    <template #inputError v-if="authErrors.password">
                        {{ authErrors.password }}
                    </template>
                </FormInput>
            </div>
            
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