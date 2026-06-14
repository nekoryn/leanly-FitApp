<template>
    <label class="ml-1 md:text-xl dark:text-[#c9cbd0]" :for="id">
        <slot name="textareaLabel">

        </slot>
    </label>
    <textarea
        class="w-full p-2 h-25 min-h-25 max-h-25 border-2 appearance-none dark:text-[#c9cbd0] border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] focus:border-[#419400] dark:focus:border-[#3abdf7] user-invalid:border-[#f83a57] dark:user-invalid:border-[#fb7085] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3"
        :name="name" 
        :id="id"
        :placeholder="placeholder"
        :value="modelValue"
        @input="onInput"
        >

    </textarea>
</template>

<script setup lang="ts">
defineProps<{
    modelValue?: string
    id?: string
    name?: string
    placeholder?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()


const onInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
}
</script>