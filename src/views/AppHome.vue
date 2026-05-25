<script setup lang="ts">
    import { computed, onMounted } from 'vue';
    import { useAuthStore } from '@/stores/authstore';
    import FormInput from '@/components/ui/FormInput.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import HomeLayout from '@/layout/HomeLayout.vue';
    import { ref } from 'vue';
    import type { WeightHistory } from '@/types/weightHistory';
    import WeightChart from '@/components/charts/WeightChart.vue';
    import { chartKey } from '@/keys/chartKey';
    import type { Meal } from '@/types/meal';
    import type { DailyStats } from '@/types/dailyStats';

    const mealType = ref('breakfast')
    const mealName = ref('')
    const calories = ref('')
    const proteins = ref('')
    const fats = ref('')
    const carbs = ref('')
    const auth = useAuthStore()
    const currentWeight = ref('')
    const steps = ref('')
    const burnedCalories = ref('')
    const waterMl = ref('')
    const summary = ref([])
    const todayStats = ref<DailyStats | null>(null)
    const weights = ref<WeightHistory[]>([])
    const selectedDate = ref(
        new Date().toLocaleDateString('en-CA')
    )
    const meals = ref<Meal[]>([])

    const loadMeals = async () => {
        const res = await fetch(`http://localhost:3000/api/meals/${selectedDate.value}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        }) 
        meals.value = await res.json()
        console.log(meals.value)
    }

    async function loadSummaryMeal() {
        const res = await fetch(`http://193.233.133.68/api/meals/${selectedDate.value}/summary`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        summary.value = await res.json()
        console.log(summary.value)
    }

    const submitMeal = async () => {
        await fetch('http://193.233.133.68/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                meal_type: mealType.value,
                meal_name: mealName.value,
                calories: Number(calories.value),
                proteins: Number(proteins.value),
                fats: Number(fats.value),
                carbs: Number(carbs.value)
            })
        })
        await loadMeals()

        mealName.value = ''
        calories.value = ''
        proteins.value = ''
        fats.value = ''
        carbs.value = ''
    }

    const bmr = computed(() => {
        const user = auth.user
        if (!user) {
            return 0
        }

        const weight = Number(user.userWeight)
        const height = Number(user.userHeight)
        const age = Number(user.userAge)

        if (user.gender === 'male') {
            return 10 * weight + 6.25 * height - 5 * age + 5
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161
        }
    })

    const tdee = computed(() => {
        const user = auth.user
        if (!user) {
            return 0
        }

        const bmrValue = bmr.value

        const multipliers: Record<string, number> = {
            passive: 1.2,
            low: 1.375,
            medium: 1.55,
            high: 1.725,
            ultra: 1.9,
        }

        return bmrValue * (multipliers[user.activity] || 1.2)
    })

    function targetCalories(goal: string) {
        const base = tdee.value

        switch (goal) {
            case 'fit':
                return base * 0.85
            case 'weightMaintenance':
                return base
            case 'bodyBuild':
                return base + 300
            default:
                return base
        }
    }


    async function submitWeight() {
        const res = await fetch('http://193.233.133.68/api/weight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },

            body: JSON.stringify({
                weight: currentWeight.value
            })
        })

        const data = await res.json()

        console.log(data)

        if (auth.user) {
            auth.user.userWeight = Number(currentWeight.value)
        }

        currentWeight.value = ''

        await fetchWeightHistory()
    }

    async function fetchWeightHistory() {
        const res = await fetch('http://193.233.133.68/api/weight-history',{
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        weights.value = await res.json()
    }

    async function loadStats() {
        const res = await fetch(`http://193.233.133.68/api/daily-stats/${selectedDate.value}`, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })

        todayStats.value = await res.json()
        console.log(todayStats.value)
    }

    async function saveStats() {
        await fetch('http://193.233.133.68/api/daily-stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify({
                summary_date: selectedDate.value,
                steps: Number(steps.value),
                burned_calories: Number(burnedCalories.value),
                water_ml: Number(waterMl.value)
            })
        })

        await loadStats()

        steps.value = ''
        burnedCalories.value = ''
        waterMl.value = ''

    }


    onMounted(() => {
        fetchWeightHistory()
        loadMeals()
        loadStats()
        loadSummaryMeal()
    })
</script>

<template>
    <HomeLayout>
        <section class="flex flex-col gap-3 md:w-3xl lg:w-5xl">
            <h2 class="text-2xl dark:text-[#c9cbd0] font-bold md:text-3xl md:w-3xl">Суточная норма калорий для</h2>
            <div class="flex flex-col items-center gap-3">
                <div class="flex items-stretch md:w-3xl lg:w-5xl">
                    <div class="bg-[#419400] flex items-center justify-center px-4 py-8 dark:bg-[#3abdf7] w-30 rounded-l-xl md:flex-1 md:text-xl">
                        <p>Сброса веса</p>
                    </div>
                    <div class="bg-[#f8fdef] w-50 flex flex-col items-center justify-center dark:bg-[#0a1120] rounded-r-xl p-4 transition-colors duration-100 md:p-7 md:py-15 md:flex-1 ">
                        <p class="text-2xl font-semibold dark:text-[#c9cbd0]">{{ targetCalories('fit').toFixed(0) }} ККАЛ</p>
                    </div>
                </div>
    
                <div class="flex items-stretch md:w-3xl lg:w-5xl">
                    <div class="bg-[#419400] flex items-center justify-center px-4 py-8 dark:bg-[#3abdf7] w-30 rounded-l-xl md:flex-1 md:text-xl ">
                        <p>Поддержания веса</p>
                    </div>
                    <div class="bg-[#f8fdef] w-50 flex flex-col items-center justify-center dark:bg-[#0a1120] rounded-r-xl p-4 transition-colors duration-100 md:p-7 md:py-15 md:flex-1 ">
                        <p class="text-2xl font-semibold dark:text-[#c9cbd0]" >{{ targetCalories('weightMaintenance').toFixed(0) }} ККАЛ</p>
                    </div>
                </div>
    
                <div class="flex items-stretch md:w-3xl lg:w-5xl">
                    <div class="bg-[#419400] flex items-center justify-center px-4 py-8 dark:bg-[#3abdf7] w-30 rounded-l-xl md:flex-1 md:text-xl">
                        <p>Набора мышечной массы</p>
                    </div>
                    <div class="bg-[#f8fdef] w-50 flex flex-col items-center justify-center dark:bg-[#0a1120] rounded-r-xl p-4 transition-colors duration-100 md:p-7 md:py-15 md:flex-1">
                        <p class="text-2xl font-semibold dark:text-[#c9cbd0]">{{ targetCalories('bodyBuild').toFixed(0) }} ККАЛ</p>
                    </div>
                </div>
            </div>
        </section>
        <section class="bg-[#f8fdef] dark:bg-[#0a1120] w-90 rounded-xl mt-8 p-4 md:w-3xl md:mt-16 lg:w-5xl lg:mt-20">
            <h2 class="text-2xl dark:text-[#c9cbd0] font-bold md:text-3xl">Обновление веса</h2>
            <form @submit.prevent="submitWeight">
                <FormInput v-model="currentWeight" id="currentWeight" name="currentWeight" placeholder="Введите вес в кг" type="number">
                    Введите ваш текущий вес
                </FormInput>

                <NextStepBtn>
                    Отправить
                </NextStepBtn>
            </form>

        </section>
        <section class="bg-[#f8fdef] dark:bg-[#0a1120] w-90 rounded-xl mt-8 p-4 md:w-3xl md:mt-16 lg:w-5xl lg:mt-20">
            <h2 class="text-2xl dark:text-[#c9cbd0] font-bold md:text-3xl">Добавить запись в дневник питания</h2>

            <form @submit.prevent="submitMeal" class="flex flex-col gap-2">
                <FormInput v-model="mealName" id="mealName" name="mealName" type="text" placeholder="Введите название блюда или блюд">
                    Название блюда
                </FormInput>

                <div class="w-full dark:text-[#c9cbd0]">
                    <label class="ml-1 md:text-xl" for="everydayActivity">Прием пищи</label>
                    <select v-model="mealType" class="p-2 w-full border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3" name="everydayActivity" id="everydayActivity">
                        <option value="breakfast">Завтрак</option>
                        <option value="snack">Перекус</option>
                        <option value="lunch">Обед</option>
                        <option value="dinner">Ужин</option>
                    </select>
                </div>

                <FormInput v-model="calories" id="mealBmi" name="mealBmi" type="number" placeholder="Введите пищевую ценность блюда">
                    Пищевая ценность (ккал)
                </FormInput>

                <FormInput v-model="proteins" id="mealProteins" name="mealProteins" type="number" placeholder="Введите количество белков (в гр.)">
                    Белки
                </FormInput>

                <FormInput v-model="fats" id="mealFats" name="mealFats" type="number" placeholder="Введите количество жиров (в гр.)">
                    Жиры
                </FormInput>

                <FormInput v-model="carbs" id="mealCarbs" name="mealCarbs" type="number" placeholder="Введите количество углеводов (в гр.)">
                    Углеводы
                </FormInput>

                <NextStepBtn>
                    Обновить
                </NextStepBtn>
            </form>
        </section>
        <section class="bg-[#f8fdef] dark:bg-[#0a1120] w-90 rounded-xl mt-8 p-4 md:w-3xl md:mt-16 lg:w-5xl lg:mt-20">
            <h2 class="text-2xl mb-4 dark:text-[#c9cbd0] font-bold md:text-3xl">Дневник питания</h2>
            <div class="bg-[#cbcfc3] dark:bg-[#0f172a] dark:text-[#c9cbd0] rounded-xl mb-2 p-2 md:flex md:justify-between md:items-center" v-for="meal in meals" :key="meal.mid">
                <div>
                    <p class="text-xl font-bold md:text-2xl">{{ meal.meal_name }}</p>
                    <p class="font-light md:text-xl">{{ meal.meal_type }}</p>
                    <p class="font-semibold md:text-xl">Калорийность: {{ meal.calories }} ккал</p>
                </div>
                <div class="hidden md:block w-60 bg-[#f8fdef] dark:bg-[#0a1120] p-2 rounded-xl text-center">
                    <p class="text-xl font-light">Белки: {{ meal.proteins }} г</p>
                    <p class="text-xl font-light">Жиры: {{ meal.fats }} г</p>
                    <p class="text-xl font-light">Углеводы: {{ meal.carbs }} г</p>
                </div>
            </div>
        </section>
        <section class="bg-[#f8fdef] dark:bg-[#0a1120] w-90 rounded-xl mt-8 p-4 md:w-3xl md:mt-16 lg:w-5xl lg:mt-20">
            <h2 class="text-2xl dark:text-[#c9cbd0] font-bold md:text-3xl">График веса</h2>

            <WeightChart :weights="weights" :key="chartKey"></WeightChart>
        </section>
        <section class="bg-[#f8fdef] dark:bg-[#0a1120] w-90 rounded-xl mt-8 p-4 md:w-3xl md:mt-16 lg:w-5xl lg:mt-20">
            <h2 class="text-2xl dark:text-[#c9cbd0] font-bold md:text-3xl">Подвести итоги дня</h2>
            <form @submit.prevent="saveStats" class="flex flex-col gap-2">

                <FormInput v-model="steps" id="stepsCount" name="stepsCount" type="number" placeholder="Введите количество шагов">
                    Количество шагов
                </FormInput>

                <FormInput v-model="burnedCalories" id="burnedKcal" name="burnedKcal" type="number" placeholder="Введите количество (в ккал)">
                    Сожжено калорий
                </FormInput>

                <FormInput v-model="waterMl" id="waterDrinked" name="waterDrinked" type="number" placeholder="Введите количество (в мл)">
                    Выпито воды
                </FormInput>

                <NextStepBtn>
                    Отправить
                </NextStepBtn>
            </form>
        </section>
        <section class="bg-[#f8fdef] dark:bg-[#0a1120] w-90 rounded-xl mt-8 p-4 md:w-3xl md:mt-16 lg:w-5xl lg:mt-20"
            :class="todayStats?.burned_calories === 0 && todayStats.steps === 0 && todayStats.water_ml === 0 ? 'hidden' : 'block'">
            <h2 class="text-2xl dark:text-[#c9cbd0] font-bold md:text-3xl">Итоги дня</h2>
            <div class="dark:text-[#c9cbd0] bg-[#e1e6d9] dark:bg-[#0f172a] p-2 rounded-xl md:p-4">
                <p class="font-light md:text-xl">Сожжено {{ todayStats?.burned_calories }} ккал</p>
                <p class="font-light md:text-xl">Пройдено {{ todayStats?.steps }} шагов</p>
                <p class="font-light md:text-xl">Выпито {{ todayStats?.water_ml }} миллилитров воды</p>
                <p class="font-bold md:text-xl">Так держать!</p>
            </div>
        </section>
    </HomeLayout>
</template>