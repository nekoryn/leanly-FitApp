<script setup lang="ts">
import { submitMeal } from '@/api/mealsApi';
import DefaultSection from '@/components/ui/DefaultSection.vue';
import FormSelect from '@/components/ui/FormSelect.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RecepieCard from '@/components/ui/RecepieCard.vue';
import RedButton from '@/components/ui/RedButton.vue';
import RecepiesLayout from '@/layout/RecepiesLayout.vue';
import { useRecepieStore } from '@/stores/recepieStore'; 
import { storeToRefs } from 'pinia';                     
import { onMounted, ref, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL
const router = useRouter()
const toast = useToast()

const mealType = ref('')
const mealName = ref('')
const calories = ref(0)
const proteins = ref(0)
const fats = ref(0)
const carbs = ref(0)
const selectedDate = ref(
    new Date().toLocaleDateString('en-CA')
)


const recipeStore = useRecepieStore()
const { filterRecepies, recipesList } = storeToRefs(recipeStore)
const dialog = useTemplateRef('addToMealsDialog')

const onAddRecipe = (rid: number | string) => {
    console.log(`Добавляем в план рецепт с ID: ${rid}`);
    const foundRecipe = recipesList.value.find(item => item.rid === rid);
    if (foundRecipe) {
        mealName.value = foundRecipe.title
        calories.value = foundRecipe.calories
        proteins.value = foundRecipe.proteins
        fats.value = foundRecipe.fats
        carbs.value = foundRecipe.carbs
    }
    dialog.value?.showModal()
};

async function AddRecepie() {
    try {
        await submitMeal({
            meal_type: mealType.value,
            meal_name: mealName.value,
            calories: String(calories.value),
            proteins: String(proteins.value),
            carbs: String(carbs.value),
            fats: String(fats.value),
        }, selectedDate.value)

        mealName.value = ''
        mealType.value = ''
        calories.value = 0
        proteins.value = 0
        fats.value = 0
        carbs.value = 0
        dialog.value?.close()
        toast.success('Рецепт успешно добавлен в дневник питания!')
    } catch (err) {
        console.log(err)
        toast.error('Попробуйте еще раз.')
    }
}

function closeAddRecipe() {
    mealName.value = ''
    mealType.value = ''
    calories.value = 0
    proteins.value = 0
    fats.value = 0
    carbs.value = 0

    dialog.value?.close()
}

const onOpenRecipe = (rid: number | string) => {
    console.log(`Переходим на страницу рецепта с ID: ${rid}`);
    router.push({ name: 'recepie-detail', params: { rid } });
};


onMounted(async () => {
    await recipeStore.fetchRecipes()
})
</script>

<template>
    <RecepiesLayout>
        <template #mainContent>
            <div v-if="recipesList.length > 0" class="flex flex-col gap-4 w-full">
                
                <div v-if="filterRecepies.length > 0" class="grid grid-cols-1 gap-4 justify-center md:grid-cols-3">
                    <RecepieCard 
                        v-for="recepie in filterRecepies" 
                        :key="recepie.rid" 
                        :id="recepie.rid" 
                        :title="recepie.title" 
                        :imageSrc="recepie.recepie_image && recepie.recepie_image.trim() !== ''
                            ? `${AVATAR_BASE_URL}/uploads/recepies/${recepie.recepie_image}`
                            : `${AVATAR_BASE_URL}/uploads/recepies/default_recipe.webp`" 
                        @add="onAddRecipe" 
                        @open="onOpenRecipe"
                    >
                    </RecepieCard>
                </div>
        
                <div class="mt-35 text-center" v-else>
                    <p class="md:text-xl">По вашему запросу ничего не найдено</p>
                </div>
            </div>
            
            <div class="mt-35 text-center" v-else>
                <p class="md:text-xl">Похоже рецептов пока нет. Будьте первым, кто их добавит!</p>
            </div>
        </template>

        <template #dialogContent>
            <dialog ref="addToMealsDialog" class="fiexed inset-0 m-auto min-w-90 rounded-xl backdrop:bg-[#cbcfc37f] bg-[#00000000] dark:backdrop:bg-[#0f172a74]">
                <DefaultSection noMargin>
                    <template #h2Header>
                        Добавить рецепт в дневник питания
                    </template>
                    <template #mainContent>
                        <form @submit.prevent="AddRecepie" class="my-2">
                            <FormSelect id="meal_type" name="meal_type" v-model="mealType">
                                <template #selectLabel>
                                    Выберите прием пищи
                                </template>
                                <template #options>
                                    <option value="" disabled>Выберите прием пищи</option>
                                    <option value="breakfast">Завтрак</option>
                                    <option value="lunch">Обед</option>
                                    <option value="dinner">Ужин</option>
                                    <option value="snack">Перекус</option>
                                </template>
                            </FormSelect>
        
                            <div class="flex justify-between items-center mt-4">
                                <RedButton @click="closeAddRecipe" type="button">
                                    Закрыть
                                </RedButton>
                                <NextStepBtn noMargin>
                                    Добавить
                                </NextStepBtn>
                            </div>
                        </form>
                    </template>
                </DefaultSection>

            </dialog>
        </template>
    </RecepiesLayout>
</template>