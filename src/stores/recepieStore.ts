import type { recepiesList } from '@/types/recepiesListType';
import { defineStore } from 'pinia';

export const useRecepieStore = defineStore('resepies', {
    state: () => ({
        recipesList: [] as recepiesList[],

        title: '',
        recepie_image: null as File | null,
        description: '',
        ingredients: '',
        main_text: '',
        proteins: '',
        fats: '',
        carbs: '',
        calories: '',
        nickname: '',
        user_avatar: ''
    }),
    actions: {
        resetForm() {
            this.title = '';
            this.recepie_image = null;
            this.description = '';
            this.ingredients = '';
            this.main_text = '';
            this.proteins = '';
            this.fats = '';
            this.carbs = '';
            this.calories = '';
        }
    }
});