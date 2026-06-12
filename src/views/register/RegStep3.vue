<template>
    <RegLayout>
        <FormHeader>Регистрация: шаг 3</FormHeader>
        <form @submit.prevent="nextStep" class="w-full flex mt-4 flex-col gap-3 items-center justify-center">
            <AvatarInput v-model="register.avatar">

            </AvatarInput>

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

<script setup lang="ts">
import AvatarInput from '@/components/ui/AvatarInput.vue';
import FormHeader from '@/components/ui/FormHeader.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RegisterSteps from '@/components/ui/RegisterSteps.vue';
import RegLayout from '@/layout/RegLayout.vue';
import { useRegisterStore } from '@/stores/register';
import { useRouter } from 'vue-router';

const register = useRegisterStore()

const router = useRouter()

const nextStep = () => {
    router.push('/register/step-4')

    console.log(register.avatar)
}
</script>