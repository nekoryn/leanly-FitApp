import { loadRecepies } from '@/api/recepiesApi';
import type { recepiesList } from '@/types/recepiesListType';
import { defineStore } from 'pinia';


export const useRecepieStore = defineStore('resepies', {
    state: () => ({
        recipesList: [] as recepiesList[],
        searchQuery: '',

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
    getters: {
        filterRecepies(state) {
            const query = state.searchQuery.toLowerCase().trim();

            if (!query) {
                return state.recipesList;
            }

            return state.recipesList.filter(recipe => {
                const title = recipe.title ? String(recipe.title).toLowerCase() : '';
                const description = recipe.description ? String(recipe.description).toLowerCase() : '';
                const ingredients = recipe.ingredients ? String(recipe.ingredients).toLowerCase() : '';
                const mainText = recipe.main_text ? String(recipe.main_text).toLowerCase() : '';

                return title.includes(query) || 
                    description.includes(query) || 
                    ingredients.includes(query) ||
                    mainText.includes(query);
            });
        }
    },
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
        },
        deleteRecipeFromList(rid: number | string) {
            this.recipesList = this.recipesList.filter(item => item.rid !== rid)
        },
        async fetchRecipes() {
            try {
                const data = await loadRecepies()
                this.recipesList = data;
            } catch (err) {
                if (err instanceof Error && err.message === 'Рецепты не найдены') {
                    this.recipesList = [];
                } else {
                    console.error('Ошибка при загрузке рецептов в стор:', err);
                    throw err;
                }
            }
        }
    }
});