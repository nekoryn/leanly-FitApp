<script setup lang="ts">
import { submitAuth } from '@/api/authApi';
import FormHeader from '@/components/ui/FormHeader.vue';
import FormInput from '@/components/ui/FormInput.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RegLayout from '@/layout/RegLayout.vue';
import { ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { authErrors } from '@/api/authApi.ts';
import RegAuthLink from '@/components/ui/RegAuthLink.vue';


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
                <FormInput v-model="password" name="password" id="password" placeholder="Введите пароль" type="password" minlength="10" maxlength="128" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,128}$" @validation="authErrors.password = $event">
                    <template #inputLabel>
                        Пароль
                    </template>

                    <template #inputError v-if="authErrors.password">
                        {{ authErrors.password }}
                    </template>
                </FormInput>
            </div>
            
            <RegAuthLink to="/register/step-1">
                <template #question>
                    Еще нет аккаунта?
                </template>

                <template #link>
                    Создать
                </template>
            </RegAuthLink>
            <NextStepBtn>
                Войти
            </NextStepBtn>
        </form>
    </RegLayout>
</template>