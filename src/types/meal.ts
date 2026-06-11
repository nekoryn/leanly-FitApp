export type Meal = {
    mid: number
    user_id: number
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    meal_name: string
    calories: number
    proteins: number
    fats: number
    carbs: number
    created_at: string
}