<script setup lang="ts">
import { deleteRecipe, loadRecepies, updateRecipes } from '@/api/recepiesApi';
import DefaultSection from '@/components/ui/DefaultSection.vue';
import FormInput from '@/components/ui/FormInput.vue';
import FormTextArea from '@/components/ui/FormTextArea.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RecepieImgInput from '@/components/ui/RecepieImgInput.vue';
import RedButton from '@/components/ui/RedButton.vue';
import DefaultLayout from '@/layout/DefaultLayout.vue';
import { useAuthStore } from '@/stores/authstore';
import { useRecepieStore } from '@/stores/recepieStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const recipeStore = useRecepieStore();
const { recipesList } = storeToRefs(recipeStore);
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL

const toast = useToast()

const auth = useAuthStore()

const currentRecipeId = String(route.params.rid || route.params.id);

const recipe = computed(() => {
    return recipesList.value.find(item => String(item.rid) === currentRecipeId);
});

const router = useRouter()
const isLoading = ref(true);

const dialog = useTemplateRef('recepiesDialog')

function backToRecipies() {
    router.push('/recepies')
}

async function deliteBtnClicked() {
    try {
        console.log('Удаляем статью с rid:', recipe?.value?.rid)
        if (recipe?.value?.rid) {
            await deleteRecipe(recipe?.value?.rid)
            recipeStore.deleteRecipeFromList(recipe.value.rid);
        }
        toast.success('Рецепт удален успешно!')
        router.push('/recepies')
    } catch (err) {
        console.log(err)
        toast.error('Не удалось удалить рецепт, попробуйте позже.')
    }
}

const avatarUrl = computed(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ? true : false
    if (auth.user?.user_avatar === ' ') {
        return isDark
            ? `${AVATAR_BASE_URL}/uploads/avatars/dark_default_avatar.webp`
            : `${AVATAR_BASE_URL}/uploads/avatars/default_avatar.webp`;
    }
    return `${AVATAR_BASE_URL}/uploads/avatars/${recipe.value?.user_avatar}`;
});

async function fetchFreshData(forceUpdate = false) {
    try {
        if (recipesList.value.length === 0 || forceUpdate) {
            const data = await loadRecepies();
            recipesList.value = data;
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить данные';
        console.warn('Не удалось загрузить рецепты со своего API:', errorMessage);
        toast.error('Список рецептов пуст или недоступен.');
        router.replace('/recepies');
        return;
    }

    console.log('Найденный рецепт:', recipe.value);

    if (!recipe.value) {
        toast.error('Рецепт не найден или был удален.');
        router.replace('/recepies');
    }

    
}

onMounted(async () => {
    await fetchFreshData()
    isLoading.value = false
});

function openDialogClicked() {
    if (recipesList.value[0]) {
        recipeStore.title = recipesList.value[0].title
        recipeStore.description = recipesList.value[0].description
        recipeStore.ingredients = recipesList.value[0].ingredients
        recipeStore.main_text = recipesList.value[0].main_text
        recipeStore.proteins = String(recipesList.value[0].proteins)
        recipeStore.fats = String(recipesList.value[0].fats)
        recipeStore.carbs = String(recipesList.value[0].carbs)
        recipeStore.calories = String(recipesList.value[0].calories)
    }
    dialog.value?.showModal()
}

function closeDialogClicked() {
    dialog.value?.close()
    recipeStore.resetForm()
}

async function updateRecipe() {
    try {
        if (recipe?.value?.rid) {
            await updateRecipes(recipe.value.rid)
            await fetchFreshData(true)
            closeDialogClicked()
            toast.success('Рецепт успешно изменен!')
        }
    } catch (err) {
        console.log(err)
        toast.error('Не удалось изменить рецепт, попробуйте позже.')
    }
}

</script>

<template>
    <DefaultLayout>
        <div v-if="isLoading" class="flex justify-center items-center min-h-100 text-xl dark:text-[#c9cbd0]">
            <p>Загрузка рецепта...</p>
        </div>

        <div class="flex flex-col items-center w-90 md:w-3xl lg:w-5xl bg-[#f8fdef] dark:bg-[#0a1120] dark:text-[#c9cbd0] min-h-100 rounded-xl p-5"
            v-else-if="recipe">
            <RedButton class="self-start mb-5" @click="backToRecipies">
                Назад к рецептам
            </RedButton>
            <img class="w-80 h-80 rounded-xl border-4 border-[#419400] dark:border-[#3abdf7] md:w-100 md:h-100 lg:w-120 lg:h-120"
                :src="`${AVATAR_BASE_URL}/uploads/recepies/${recipe?.recepie_image}`" alt="картинка рецепта">
            <div class="w-full">
                <h1 class="text-2xl font-bold my-4 md:text-3xl lg:text-4xl lg:my-8">{{ recipe?.title }}</h1>
                <div
                    class="flex gap-2 justify-center bg-[#e1e6d9] dark:bg-[#0f172a] p-4 px-6 rounded-xl md:text-xl lg:text-2xl">
                    <p>Б: {{ recipe?.proteins }}</p>
                    <p>Ж: {{ recipe?.fats }}</p>
                    <p>У: {{ recipe?.carbs }}</p>
                </div>
                <p class="font-bold md:text-xl lg:text-2xl">Ккал на одну порцию: {{ recipe?.calories }}</p>
                <p class="my-2 font-light text-left md:text-xl md:my-4 lg:text-2xl lg:my-6"><span
                        class="font-bold">Описание:</span> {{ recipe?.description }}</p>
            </div>
            <div class="w-full">
                <p class="font-bold md:text-xl lg:text-2xl">Ингредиенты:</p>
                <p class="whitespace-pre-line leading-relaxed md:text-xl lg:text-2xl">{{ recipe?.ingredients }}</p>
            </div>
            <div class="w-full my-2 md:my-4 md:text-xl lg:text-2xl lg:my-6">
                <p class="font-bold">Рецепт:</p>
                <p class="whitespace-pre-line leading-relaxed">{{ recipe?.main_text }}</p>
                <p class="text-xl font-bold text-center md:text-2xl lg:text-3xl">Приятного аппетита!</p>
            </div>
            <div class="flex justify-between items-center w-full my-2">
                <div class="flex items-center gap-4 bg-[#cbcfc3] dark:bg-[#0f172a] p-2 rounded-xl">
                    <img class="w-15 h-15 border-2 border-[#419400] dark:border-[#3abdf7] rounded-full md:w-20 md:h-20 object-cover"
                        :src="`${avatarUrl}`" alt="">
                    <RouterLink
                        class="font-semibold md:text-xl hover:text-[#419400] dark:hover:text-[#3abdf7] cursor-pointer"
                        v-if="recipe?.nickname" :to="`/profile/${recipe.user_id}`">{{ recipe.nickname }}</RouterLink>
                    <p v-else class="font-semibold md:text-xl">Удаленный аккаунт</p>
                </div>

                <div v-if="(auth.user?.uid === recipe?.user_id) || (auth.user?.role === 'admin')"
                    class="h-full flex items-center p-2 gap-2 bg-[#cbcfc3] dark:bg-[#0f172a] rounded-xl">
                    <button @click="deliteBtnClicked"
                        class="bg-red-300 dark:bg-[#fb7085] p-2 rounded-xl cursor-pointer border-3 border-red-300 dark:border-[#fb7085] dark:text-black dark:hover:text-[#cdd0d4] hover:bg-transparent transition-colors duration-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    <button
                        @click="openDialogClicked"
                        class="p-2 rounded-xl bg-[#419400] dark:bg-[#3abdf7] cursor-pointer border-3 border-[#419400] dark:border-[#3abdf7] dark:text-black dark:hover:text-[#cdd0d4] hover:bg-transparent transition-colors duration-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>
                </div>
            </div>
            <dialog ref="recepiesDialog"
                class="fixed m-auto min-w-90 rounded-xl md:min-w-3xl lg:min-w-5xl inset-0 z-2 bg-[#00000000] backdrop:bg-[#cbcfc37f] dark:backdrop:bg-[#0f172a74]">
                <DefaultSection noMargin>
                    <template #h2Header>
                        Добавить рецепт
                    </template>

                    <template #mainContent>
                        <form @submit.prevent="updateRecipe" class="w-full">
                            <div class="flex flex-col w-full md:flex-row md:justify-between mt-4 gap-6">

                                <div class="w-80 flex flex-col gap-4 md:justify-between shrink-0 mx-auto md:mx-0">
                                    <RecepieImgInput v-model="recipeStore.recepie_image" :old-image="recipe.recepie_image"/>

                                    <FormInput v-model="recipeStore.calories" id="recepie_calories" name="recepie_calories">
                                        <template #inputLabel>Калорийность (ккал)</template>
                                    </FormInput>

                                    <div class="grid grid-cols-3 gap-2">
                                        <FormInput v-model="recipeStore.proteins" id="recepie_proteins"
                                            name="recepie_proteins"><template #inputLabel>Белки</template></FormInput>
                                        <FormInput v-model="recipeStore.fats" id="recepie_fats" name="recepie_fats">
                                            <template #inputLabel>Жиры</template>
                                        </FormInput>
                                        <FormInput v-model="recipeStore.carbs" id="recepie_carbs" name="recepie_carbs">
                                            <template #inputLabel>Углев.</template>
                                        </FormInput>
                                    </div>
                                </div>

                                <div class="flex-1 flex flex-col gap-4 w-full">
                                    <FormInput v-model="recipeStore.title" id="recepie_title" name="recepie_title">
                                        <template #inputLabel>Название рецепта</template>
                                    </FormInput>

                                    <FormTextArea v-model="recipeStore.description" id="recepie_description"
                                        name="recepie_description">
                                        <template #textareaLabel>Краткое описание</template>
                                    </FormTextArea>

                                    <FormTextArea placeholder="Каждый продукт с новой строки."
                                        v-model="recipeStore.ingredients" id="recepie_ingredients"
                                        name="recepie_ingredients">
                                        <template #textareaLabel>Ингредиенты</template>
                                    </FormTextArea>

                                    <FormTextArea v-model="recipeStore.main_text" id="recepie_main_text"
                                        name="recepie_main_text">
                                        <template #textareaLabel>Основной текст (Приготовление)</template>
                                    </FormTextArea>
                                </div>
                            </div>

                            <div
                                class="flex justify-between items-center mt-6 pt-4 border-t border-[#cbcfc3] dark:border-[#13203a]">
                                <RedButton @click="closeDialogClicked" type="button">
                                    Закрыть
                                </RedButton>
                                <NextStepBtn :noMargin="true">
                                    Добавить
                                </NextStepBtn>
                            </div>
                        </form>
                    </template>
                </DefaultSection>
            </dialog>
        </div>
    </DefaultLayout>
</template>