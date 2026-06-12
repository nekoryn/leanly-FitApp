<script setup lang="ts">
    import RegLayout from '@/layout/RegLayout.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import FormHeader from '@/components/ui/FormHeader.vue';
    import { registerErrors, submitReg } from '@/api/registerApi/registerFinallApi';
    import FormInput from '@/components/ui/FormInput.vue';
    import { useRegisterStore } from '@/stores/register';
    import RegisterSteps from '@/components/ui/RegisterSteps.vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toastification';
    import SelectYourActivity from '@/components/ui/userParams/SelectYourActivity.vue';
    import SelectYourGoal from '@/components/ui/userParams/SelectYourGoal.vue';

    const register = useRegisterStore();
    const router = useRouter()
    const toast = useToast()

    async function submitRegHandle() {

        try {
            const res = await submitReg();
            toast.success('Пользователь создан успешно!')
            console.log("Успех", res)
            console.log(registerErrors.value)
            router.push('/auth')
            register.$reset()
        } catch (err) {
            console.log(err)
            toast.error('Не удалось создать пользователя.')
        }
    }
</script>

<template>
    <RegLayout>
        <FormHeader>Регистрация: шаг 4</FormHeader>
        <form @submit.prevent="submitRegHandle" class="w-full flex mt-4 flex-col gap-3 items-center justify-center">
            <SelectYourActivity v-model="register.activity">

            </SelectYourActivity>

            <SelectYourGoal v-model="register.goal">

            </SelectYourGoal>
            
            <FormInput v-model="register.goalWeight" id="goalWeight" name="goalWeight" placeholder="Введите вес в кг" type="number" min="30" max="250" step="0.01" required @validation="registerErrors.goalWeight = $event">
                <template #inputLabel>
                    Сколько бы хотели весить?
                </template>

                <template #inputError v-if="registerErrors.goalWeight">
                    {{ registerErrors.goalWeight }}
                </template>
            </FormInput>

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