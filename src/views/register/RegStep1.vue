<script setup lang="ts">
    import RegLayout from '@/layout/RegLayout.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import { useRouter } from 'vue-router';
    import { useRegisterStore } from '@/stores/register';
    import FormInput from '@/components/ui/FormInput.vue';
    import FormHeader from '@/components/ui/FormHeader.vue';
    import { ref } from 'vue';

    const router = useRouter();

    const register = useRegisterStore();

    const confirmPassword = ref('')

    const nextStep = () => {
        if (register.password !== confirmPassword.value) {
            
        } else {
            router.push('/register/step-2')
        }
    }
</script>
<template>
    <RegLayout>
            <FormHeader>Регистрация: шаг 1</FormHeader>
            <form @submit.prevent="nextStep" class="w-full flex mt-4 flex-col gap-3 items-center justify-center text-[#151614]">
                <FormInput v-model="register.nickname" id="nickName" name="nickName" type="text" placeholder="Введите никнейм" minlength="2" maxlength="30" required>
                    Никнейм
                </FormInput>

                <FormInput v-model="register.email" id="email" name="email" type="email" placeholder="Введите email" maxlength="100" required>
                    Электронная почта
                </FormInput>

                <FormInput v-model="register.password" id="password" name="password" type="password" placeholder="Введите пароль" minlength="10" maxlength="128" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,128}$" required>
                    Пароль
                </FormInput>

                <FormInput v-model="confirmPassword" id="confirmPassword" name="confirmPassword" type="password" placeholder="Введите пароль" minlength="10" maxlength="128" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,128}$" required>
                    Подтвердите пароль
                </FormInput>

                <NextStepBtn>
                    Далее
                </NextStepBtn>
            </form>
    </RegLayout>
</template>