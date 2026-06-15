<script setup lang="ts">
import { loadRecepies } from '@/api/recepiesApi';
import RecepieCard from '@/components/ui/RecepieCard.vue';
import RecepiesLayout from '@/layout/RecepiesLayout.vue';
import { useRecepieStore } from '@/stores/recepieStore'; 
import { storeToRefs } from 'pinia';                     
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL
const router = useRouter()


const recipeStore = useRecepieStore()
const { filterRecepies, recipesList } = storeToRefs(recipeStore)

const onAddRecipe = (rid: number | string) => {
    console.log(`Добавляем в план рецепт с ID: ${rid}`);
};

const onOpenRecipe = (rid: number | string) => {
    console.log(`Переходим на страницу рецепта с ID: ${rid}`);
    router.push({ name: 'recepie-detail', params: { rid } });
};

onMounted(async () => {
    const data = await loadRecepies()
    
    recipesList.value = data;
})
</script>

<template>
    <RecepiesLayout>
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
    </RecepiesLayout>
</template>