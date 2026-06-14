<template>
    <div class="bg-[#f8fdef] dark:bg-[#0a1120] p-4 rounded-2xl flex flex-col justify-between w-full">
        <div class="mb-3">
            <h3 class="text-xl font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                {{ title }}
            </h3>
            <div class="mt-1">
                <slot name="displayValue"></slot>
            </div>
        </div>

        <form @submit.prevent="emit('submit')" class="flex flex-col gap-6">
            <FormInput :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" :id="inputId"
                :name="inputName" type="number" :placeholder="placeholder" :min="min" :max="max"
                @validation="emit('validation', $event)">
                <template #inputError v-if="$slots.inputError">
                    <slot name="inputError"></slot>
                </template>
            </FormInput>

            <NextStepBtn :noMargin="true" class="w-full justify-center flex">
                {{ btnText }}
            </NextStepBtn>
        </form>
    </div>
</template>

<script setup lang="ts">
import FormInput from './FormInput.vue';
import NextStepBtn from './NextStepBtn.vue';

defineProps<{
    modelValue: string;
    title: string;
    btnText: string;
    inputId: string;
    inputName: string;
    placeholder?: string;
    min?: number | string;
    max?: number | string;
    type?: string
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'validation', message: string): void;
    (e: 'submit'): void;
}>();
</script>