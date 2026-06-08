<script setup lang="ts">
    import RegLayout from '@/layout/RegLayout.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import { useRouter } from 'vue-router';
    import FormInput from '@/components/ui/FormInput.vue';
    import FormHeader from '@/components/ui/FormHeader.vue';
    import { useRegisterStore } from '@/stores/register';
    import RegisterSteps from '@/components/ui/RegisterSteps.vue';
import { registerErrors } from '@/api/registerApi/registerFinallApi';

    const register = useRegisterStore()

    const router = useRouter();

    const nextStep = () => {
        router.push('/register/step-3')
    }
</script>

<template>
    <RegLayout>
        <FormHeader>Регистрация: шаг 2</FormHeader>
        <form @submit.prevent="nextStep" class="w-full flex mt-4 flex-col gap-3 items-center justify-center">
            <FormInput v-model="register.userWeight" id="userWeight" name="userWeight" min="30" max="250" step="0.01" placeholder="Введите вес (в кг)" type="number" @validation="registerErrors.userWeight = $event" required>
                <template #inputLabel>
                    Сколько вы весите?
                </template>

                <template #inputError v-if="registerErrors.userWeight">
                    {{ registerErrors.userWeight }}
                </template>
            </FormInput>

            <FormInput v-model="register.userHeight" id="userHeight" name="userHeight" min="120" max="240" step="0.01" placeholder="Введите рост (в см)" type="number" required @validation="registerErrors.userHeight = $event">
                <template #inputLabel>
                    Какой у вас рост?
                </template>

                <template #inputError v-if="registerErrors.userHeight">
                    {{ registerErrors.userHeight }}
                </template>
            </FormInput>

            <FormInput v-model="register.userAge" id="userAge" name="userAge" min="12" max="99" placeholder="Введите возраст" type="number" required @validation="registerErrors.userAge = $event">
                <template #inputLabel>
                    Сколько вам лет?
                </template>

                <template #inputError v-if="registerErrors.userAge">
                    {{ registerErrors.userAge }}
                </template>
            </FormInput>
            <div class="w-full dark:text-[#c9cbd0]">
                <label class="ml-1 md:text-xl" for="sex">Ваш пол?</label>
                <select v-model="register.gender" class="p-2 w-full border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3 user-invalid:border-[#f83a57] dark:user-invalid:border-[#fb7085]" name="sex" id="sex" required>
                    <option value="" disabled>Выберите пол</option>
                    <option value="male">мужчина</option>
                    <option value="female">женщина</option>
                </select>
            </div>

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