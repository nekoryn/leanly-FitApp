<template>
    <AppHeader noRoundedBottom>

    </AppHeader>
    <div class="flex flex-col min-h-dvh lg:flex-row lg:w-5xl lg:mx-auto lg:gap-1">
        <RecepiesNabbar>
            <template #content>
                <SearchInput v-model="searchQuery" id="recepies-search" @submit-search="handleSearch"
                    @clear="handleClear">

                </SearchInput>
                <NextStepBtn noMargin class="mt-20" @click="openDialogClicked">
                    Добавить рецепт
                </NextStepBtn>
            </template>
        </RecepiesNabbar>
        <main
            class="w-90 min-h-100 h-fit dark:bg-[#0a1120] dark:text-[#c9cbd0] bg-[#f8fdef] p-4 my-1 rounded-2xl mx-auto md:w-3xl lg:flex-1 lg:rounded-tl-none transition-colors duration-100">
            <h1 class="text-2xl mb-4 font-bold lg:mb-6 md:text-3xl">Рецепты</h1>
            <slot>

            </slot>
        </main>
    </div>
    <dialog ref="recepiesDialog"
        class="fixed m-auto min-w-90 rounded-xl md:min-w-3xl lg:min-w-5xl inset-0 z-2 bg-[#00000000] backdrop:bg-[#cbcfc37f] dark:backdrop:bg-[#0f172a74]">
        <DefaultSection noMargin>
            <template #h2Header>
                Добавить рецепт
            </template>

            <template #mainContent>
                <form @submit.prevent="AddRecepie" class="w-full">
                    <div class="flex flex-col w-full md:flex-row md:justify-between mt-4 gap-6">

                        <div class="w-80 flex flex-col gap-4 md:justify-between shrink-0 mx-auto md:mx-0">
                            <RecepieImgInput v-model="resepie.recepie_image"/>

                            <FormInput v-model="resepie.calories" id="recepie_calories" name="recepie_calories">
                                <template #inputLabel>Калорийность (ккал)</template>
                            </FormInput>

                            <div class="grid grid-cols-3 gap-2">
                                <FormInput v-model="resepie.proteins" id="recepie_proteins" name="recepie_proteins"><template #inputLabel>Белки</template></FormInput>
                                <FormInput v-model="resepie.fats" id="recepie_fats" name="recepie_fats"><template #inputLabel>Жиры</template></FormInput>
                                <FormInput v-model="resepie.carbs" id="recepie_carbs" name="recepie_carbs"><template #inputLabel>Углев.</template></FormInput>
                            </div>
                        </div>

                        <div class="flex-1 flex flex-col gap-4 w-full">
                            <FormInput v-model="resepie.title" id="recepie_title" name="recepie_title">
                                <template #inputLabel>Название рецепта</template>
                            </FormInput>

                            <FormTextArea v-model="resepie.description" id="recepie_description" name="recepie_description">
                                <template #textareaLabel>Краткое описание</template>
                            </FormTextArea>

                            <FormTextArea
                                placeholder="Каждый продукт с новой строки."
                                v-model="resepie.ingredients"
                                id="recepie_ingredients"
                                name="recepie_ingredients">
                                <template #textareaLabel>Ингредиенты</template>
                            </FormTextArea>

                            <FormTextArea v-model="resepie.main_text" id="recepie_main_text" name="recepie_main_text">
                                <template #textareaLabel>Основной текст (Приготовление)</template>
                            </FormTextArea>
                        </div>
                    </div>

                    <div class="flex justify-between items-center mt-6 pt-4 border-t border-[#cbcfc3] dark:border-[#13203a]">
                        <RedButton @click="closeDialogClicked" type="button">
                            Закрыть
                        </RedButton>
                        <p class="text-[#fb7085]">{{ firstError }}</p>
                        <NextStepBtn :noMargin="true">
                            Добавить
                        </NextStepBtn>
                    </div>
                </form>
            </template>
        </DefaultSection>
    </dialog>
    <AppFooter>

    </AppFooter>
</template>

<script setup lang="ts">
import { createRecepie, recepieErrors } from '@/api/recepiesApi';
import AppFooter from '@/components/layouts/AppFooter.vue';
import AppHeader from '@/components/layouts/AppHeader.vue';
import RecepiesNabbar from '@/components/layouts/RecepiesNabbar.vue';
import DefaultSection from '@/components/ui/DefaultSection.vue';
import FormInput from '@/components/ui/FormInput.vue';
import FormTextArea from '@/components/ui/FormTextArea.vue';
import NextStepBtn from '@/components/ui/NextStepBtn.vue';
import RecepieImgInput from '@/components/ui/RecepieImgInput.vue';
import RedButton from '@/components/ui/RedButton.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import { useRecepieStore } from '@/stores/recepieStore';
import { computed, ref, useTemplateRef } from 'vue';
import { useToast } from 'vue-toastification';

const searchQuery = ref('');
const toast = useToast()

const dialog = useTemplateRef('recepiesDialog')

const resepie = useRecepieStore()

const handleSearch = (query: string) => {
    console.log('Ищем рецепты по запросу:', query);


};

const AddRecepie = async () => {
    try {
        await createRecepie()
        closeDialogClicked()
    } catch (err) {
        console.log(err)
        toast.error('Не удалось создать рецепт.')
    }
}

const firstError = computed(() => {
    const errorsArray = Object.values(recepieErrors.value);
    return errorsArray.length > 0 ? errorsArray[0] : '';
});

const handleClear = () => {
    console.log('Поиск сброшен');
};

function openDialogClicked() {
    dialog.value?.showModal()
}

function closeDialogClicked() {
    dialog.value?.close()
}
</script>