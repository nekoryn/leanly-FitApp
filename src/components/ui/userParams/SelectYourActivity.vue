<template>
    <FormSelect id="everydayActivity" name="everydayActivity" v-model="model">
        <template #selectLabel>
            Ваша ежедневная активность?
        </template>
        <template #options>
            <option value="" disabled>Выберите активность</option>
            <option value="passive">Сидячий образ жизни</option>
            <option value="low">Тренировки 1-3 раза в неделю</option>
            <option value="medium">Тренировки 3-5 раз в неделю</option>
            <option value="high">Тренировки 5-6 раз в неделю</option>
            <option value="ultra">Постоянная физическая активность</option>
        </template>
    </FormSelect>
</template>

<script setup lang="ts">
import FormSelect from '../FormSelect.vue';

const model = defineModel<string>({
    default: ''
})
</script>