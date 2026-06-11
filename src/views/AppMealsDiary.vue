<script setup lang="ts">
    import DefaultLayout from '@/layout/DefaultLayout.vue';
    import FormInput from '@/components/ui/FormInput.vue';
    import NextStepBtn from '@/components/ui/NextStepBtn.vue';
    import { loadMeals, submitMeal, loadSummaryMeal } from '@/api/mealsApi.ts';
    import { computed, onMounted, ref, useTemplateRef} from 'vue'
    import type { Meal } from '@/types/meal';
    import { isMealsExist } from '@/api/mealsApi.ts';
    import { mealsErrors } from '@/api/mealsApi.ts';
    import DefaultSection from '@/components/ui/DefaultSection.vue';
    import { summaryMeal } from '@/api/mealsApi.ts';
    import MealSection from '@/components/ui/MealSection.vue';
    import { useToast } from 'vue-toastification';
import RedButton from '@/components/ui/RedButton.vue';


    
    const meals = ref<Meal[]>([])
    const toast = useToast()

    const dialog = useTemplateRef('mealsDialog')
    const mealType = ref('breakfast')
    const mealName = ref('')
    const calories = ref('')
    const proteins = ref('')
    const fats = ref('')
    const carbs = ref('')
    const selectedDate = ref(
        new Date().toLocaleDateString('en-CA')
    )

    

    async function handleSubmitMeal() {
        try {
            await submitMeal({
                meal_type: mealType.value,
                meal_name: mealName.value,
                calories: calories.value,
                proteins: proteins.value,
                carbs: carbs.value,
                fats: fats.value,
            }, selectedDate.value)
    
            meals.value = await loadMeals(selectedDate.value)
            summaryMeal.value = await loadSummaryMeal(selectedDate.value)
    
            mealName.value = ''
            calories.value = ''
            proteins.value = ''
            fats.value = ''
            carbs.value = ''
    
            dialog.value?.close()
            toast.success('Дневник питания обновлен!')
        } catch (err) {
            console.log(err)
            toast.error('Попробуйте еще раз.')
        }
    }

    onMounted(async () => {
        meals.value = await loadMeals(selectedDate.value)
        summaryMeal.value = await loadSummaryMeal(selectedDate.value)
        console.log(groupedMeals.value)
    })

    type MealGroups = {
        title: string
        items: Meal[]
    }

    const groupedMeals = computed(() => {
        const order = ['breakfast', 'lunch', 'dinner', 'snack']

        const groups: Record<string, MealGroups> = {
            breakfast: { title: 'Завтрак', items: []},
            snack: { title: 'Перекусы', items: []},
            lunch: { title: 'Обед', items: []},
            dinner: { title: 'Ужин', items: []}
        }
        
        meals.value?.forEach(meal => {
            if (groups[meal.meal_type]) {
                groups[meal.meal_type]?.items.push(meal)
            }
        })

        const result = order
            .map(type => ({ type, ...groups[type] }))
            .filter(group => group.items ? group.items.length > 0 : false)
        
        return result
    })

    function openDialogClicked() {
        dialog.value?.showModal()
    }

    function closeDialogClicked() {
        dialog.value?.close()
    }


</script>

<template>
    <DefaultLayout>
        <DefaultSection>
            <template #h2Header>
                Дневник питания
            </template>

            <template #mainContent>
                <p v-if="!isMealsExist" class="text-xl dark:text-[#c9cbd0] text-center mb-20 mt-20">Похоже вы пока не добавили ни одного блюда</p>
                <MealSection v-for="group in groupedMeals"
                    :key="group.type"
                    :title="group.title || ''"
                    :meals="group.items || []">

                </MealSection>
                    <div v-if="isMealsExist">
                        <p class="text-xl font-semibold md:text-2xl dark:text-[#c9cbd0]">Итого:</p>
                        <p class="md:text-xl dark:text-[#c9cbd0]">{{ summaryMeal.totalCalories }} Ккал | {{ summaryMeal.totalProteins }} Б {{ summaryMeal.totalFats }} Ж {{ summaryMeal.totalCarbs }} У</p>
                    </div>
                    <div class="flex justify-end">
                        <NextStepBtn @click="openDialogClicked">
                            Добавить запись в дневник
                        </NextStepBtn>
                    </div>
            </template>
        </DefaultSection>
    </DefaultLayout>
    <dialog ref="mealsDialog" class="fixed m-auto min-w-90 rounded-xl md:min-w-3xl lg:min-w-5xl inset-0 z-2 bg-[#00000000] backdrop:bg-[#cbcfc37f] dark:backdrop:bg-[#0f172a74]">
        <DefaultSection noMargin>
            <template #h2Header>
                Добавить запись в дневник питания
            </template>
            
            <template #mainContent>
                <form @submit.prevent="handleSubmitMeal" class="flex flex-col p-2 gap-2 md:p-4 md:gap-3">

                    <FormInput v-model="mealName" id="mealName" name="mealName" type="text" placeholder="Введите название блюда или блюд" minlength="2" maxlength="100" @validation="mealsErrors.meal_name = $event">
                        <template #inputLabel>
                            Название блюда
                        </template>

                        <template #inputError v-if="mealsErrors.meal_name">
                            {{ mealsErrors.meal_name }}
                        </template>
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
    

                    <FormInput v-model="calories" id="mealBmi" name="mealBmi" type="number" placeholder="Введите пищевую ценность блюда" min="0" max="5000" @validation="mealsErrors.calories = $event">
                        <template #inputLabel>
                            Пищевая ценность (ккал)
                        </template>
                        
                        <template #inputError v-if="mealsErrors.calories">
                            {{ mealsErrors.calories }}
                        </template>
                    </FormInput>

                    <FormInput v-model="proteins" id="mealProteins" name="mealProteins" type="number" placeholder="Введите количество белков (в гр.)" min="0" max="400" step="0.01" @validation="mealsErrors.proteins = $event">
                        <template #inputLabel>
                            Белки
                        </template>

                        <template #inputError v-if="mealsErrors.proteins">
                            {{ mealsErrors.proteins }}
                        </template>
                    </FormInput>
    
                    <FormInput v-model="fats" id="mealFats" name="mealFats" type="number" placeholder="Введите количество жиров (в гр.)" min="0" max="300" step="0.01" @validation="mealsErrors.fats = $event">
                        <template #inputLabel>
                            Жиры
                        </template>
                        
                        <template #inputError v-if="mealsErrors.fats">
                            {{ mealsErrors.fats }}
                        </template>
                    </FormInput>
    

                    <FormInput v-model="carbs" id="mealCarbs" name="mealCarbs" type="number" placeholder="Введите количество углеводов (в гр.)" min="0" max="500" step="0.01" @validation="mealsErrors.carbs = $event">
                        <template #inputLabel>
                            Углеводы
                        </template>

                        <template #inputError v-if="mealsErrors.carbs">
                            {{ mealsErrors.carbs }}
                        </template>
                    </FormInput>
                
                    <div class="flex justify-between">
                        <RedButton @click="closeDialogClicked" type="button">
                            Закрыть
                        </RedButton>
                        <NextStepBtn>
                            Обновить
                        </NextStepBtn>
                    </div>
                </form>
            </template>

        </DefaultSection>
    </dialog>
</template>
