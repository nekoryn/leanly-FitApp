<template>
    <div class="w-full dark:text-[#c9cbd0]">
        <label class="ml-1 md:text-xl" :for="id">
            <slot name="selectLabel">

            </slot>
        </label>
        <select 
        :id="id"
        :name="name"
        :value="modelValue"
        :required="required"
        @change="onChange"
            class="p-2 w-full border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3 user-invalid:border-[#f83a57] dark:user-invalid:border-[#fb7085]"
        >
            <slot name="options">

            </slot>
        </select>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    id: string
    name?: string
    modelValue: string | number 
    required?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

function onChange(event: Event) {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
}
</script>