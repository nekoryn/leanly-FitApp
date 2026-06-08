<template>
    <FormSelect id="yourGoal" name="yourGoal" v-model="model" :required="true">
        <template #selectLabel>
            Ваша цель?
        </template>
        <template #options>
            <option value="" disabled>Выберите цель</option>
            <option value="fit">Сброс веса</option>
            <option value="weightMaintenance">Поддержание веса</option>
            <option value="bodyBuild">Набор мышечной массы</option>
        </template>
    </FormSelect>

</template>

<script setup lang="ts">
import FormSelect from '../FormSelect.vue';

const model = defineModel<string>({
    default: ''
})
</script>