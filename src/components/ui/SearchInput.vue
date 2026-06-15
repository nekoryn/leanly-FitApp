<template>
    <div class="flex w-full flex-col gap-1 dark:text-[#c9cbd0]">
        <label class="ml-1 md:text-xl" :for="id">
            <slot name="inputLabel">Поиск</slot>
        </label>
        
        <div class="relative w-70">
            <div class="absolute left-3 top-0 h-full flex items-center pointer-events-none text-[#343300] dark:text-[#afb2a8]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                </svg>
            </div>

            <input
                class="p-2 pl-10 pr-4 w-70 border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] focus:border-[#419400] dark:focus:border-[#3abdf7] user-invalid:border-[#f83a57] dark:user-invalid:border-[#fb7085] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3 lg:pl-12 lg:pr-8"
                :id="id"
                :name="name"
                type="search"
                :value="modelValue"
                :placeholder="placeholder"
                :required="required"
                :pattern="pattern"
                :minlength="minlength"
                :maxlength="maxlength"
                :autocomplete="autocomplete"
                @input="onInput"
                @search="onSearchClear"
                @keydown.enter="onSubmit"
            />
        </div>

        <p class="text-[#fb7085] ml-2 my-2" v-if="$slots.inputError">
            <slot name="inputError"></slot>
        </p>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue?: string
    id?: string
    name?: string
    placeholder?: string
    required?: boolean
    pattern?: string
    minlength?: number | string
    maxlength?: number | string
    autocomplete?: string
}>(), {
    placeholder: 'Поиск...',
    autocomplete: 'off'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'validation', message: string): void
    (e: 'clear'): void
    (e: 'submit-search', value: string): void
}>()

const onInput = (e: Event) => {
    const input = e.target as HTMLInputElement
    emit('update:modelValue', input.value)
    
    if (input.validity.valueMissing) {
        emit('validation', 'Поле поиска не должно быть пустым.')
    } else if (input.validity.tooShort) {
        emit('validation', `Минимум ${props.minlength} символов(-а)`)
    } else {
        emit('validation', '')
    }
}

const onSubmit = () => {
    emit('submit-search', props.modelValue || '')
}

const onSearchClear = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.value === '') {
        emit('update:modelValue', '')
        emit('clear')
        emit('validation', '')
    }
}
</script>