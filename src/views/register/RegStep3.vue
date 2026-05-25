<script setup lang="ts">
    import RegLayout from '@/layout/RegLayout.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import { useRouter } from 'vue-router';
    import FormHeader from '@/components/ui/FormHeader.vue';
    import { useRegisterStore } from '@/stores/register';
    import FormInput from '@/components/ui/FormInput.vue';

    const router = useRouter();
    const register = useRegisterStore();

    const submitReg = async () => {
        const payload = {
            ...register.$state,
            userWeight: Number(register.userWeight),
            userHeight: Number(register.userHeight),
            userAge: Number(register.userAge),
            goalWeight: Number(register.goalWeight),
        }
        const res = await fetch('http://193.233.133.68/api/register', {
            method: "POST", 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        })
        
        if (!res.ok) {
            return;
        }

        router.push('/auth');

        register.$reset();
    }
</script>

<template>
    <RegLayout>
        <FormHeader>Регистрация: шаг 3</FormHeader>
        <form @submit.prevent="submitReg" class="w-full flex mt-4 flex-col gap-3 items-center justify-center">
            <div class="w-full dark:text-[#c9cbd0]">
                <label class="ml-1 md:text-xl" for="everydayActivity">Ваша ежедневная активность?</label>
                <select v-model="register.activity" class="p-2 w-full border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3" name="everydayActivity" id="everydayActivity">
                    <option value="passive">Сидячий образ жизни</option>
                    <option value="low">Тренировки 1-3 раза в неделю</option>
                    <option value="medium">Тренировки 3-5 раз в неделю</option>
                    <option value="high">Тренировки 5-6 раз в неделю</option>
                    <option value="ultra">Постоянная физическая активность</option>
                </select>
            </div>

            <div class="w-full dark:text-[#c9cbd0]">
                <label class="ml-1 md:text-xl" for="yourGoal">Ваша цель?</label>
                <select v-model="register.goal" class="p-2 w-full border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3" name="yourGoal" id="yourGoal">
                    <option value="fit">Сброс веса</option>
                    <option value="weightMaintenance">Поддержание веса</option>
                    <option value="bodyBuild">Набор мышечной массы</option>
                </select>
            </div>

            <FormInput v-model="register.goalWeight" id="goalWeight" name="goalWeight" placeholder="Введите вес в кг" type="number">
                Сколько бы хотели весить?
            </FormInput>
            <NextStepBtn>
                Зарегистрироватся
            </NextStepBtn>
        </form>
    </RegLayout>
</template>