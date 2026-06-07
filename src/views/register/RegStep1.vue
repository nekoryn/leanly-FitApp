<script setup lang="ts">
    import RegLayout from '@/layout/RegLayout.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import { useRouter } from 'vue-router';
    import { useRegisterStore } from '@/stores/register';
    import FormInput from '@/components/ui/FormInput.vue';
    import FormHeader from '@/components/ui/FormHeader.vue';
    import RegAuthLink from '@/components/ui/RegAuthLink.vue';
import RegisterSteps from '@/components/ui/RegisterSteps.vue';
import { registerErrors } from '@/api/registerApi/registerFinallApi';


    const router = useRouter();

    const register = useRegisterStore();

    const nextStep = () => {
            router.push('/register/step-2')
    }
</script>
<template>
    <RegLayout>
            <FormHeader>Регистрация: шаг 1</FormHeader>
            <form @submit.prevent="nextStep" class="w-full flex mt-4 flex-col gap-3 items-center justify-center text-[#151614]">
                <FormInput v-model="register.nickname" id="nickName" name="nickName" type="text" placeholder="Введите никнейм" minlength="2" maxlength="30" autocomplete="off" @validation="registerErrors.nickname = $event" required>
                    <template #inputLabel>
                        Никнейм
                    </template>

                    <template #inputError v-if="registerErrors.nickname">
                        {{ registerErrors.nickname }}
                    </template>
                </FormInput>

                <FormInput v-model="register.email" id="email" name="email" type="email" placeholder="Введите email" maxlength="100" autocomplete="email" @validation="registerErrors.email = $event" required>
                    <template #inputLabel>
                        Электронная почта
                    </template>

                    <template #inputError v-if="registerErrors.email">
                        {{ registerErrors.email }}
                    </template>
                </FormInput>

                <FormInput v-model="register.password" id="password" name="password" type="password" placeholder="Введите пароль" minlength="10" maxlength="128" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{10,128}$" autocomplete="new-password" @validation="registerErrors.password = $event" required>
                    <template #inputLabel>
                        Пароль
                    </template>

                    <template #inputError v-if="registerErrors.password">
                        {{ registerErrors.password }}
                    </template>
                </FormInput>
                <RegAuthLink to="/auth">
                        <template #question>
                            Уже есть аккаунт?
                        </template>

                        <template #link>
                            Войти
                        </template>
                    </RegAuthLink>

                <div class="flex justify-between w-full items-center">
                    <RegisterSteps>

                    </RegisterSteps>

                    <NextStepBtn noMargin>
                        Далее
                    </NextStepBtn>
                </div>

            </form>
    </RegLayout>
</template>