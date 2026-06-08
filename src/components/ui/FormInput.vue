<template>
    <div class="flex w-full flex-col gap-1 dark:text-[#c9cbd0]">
    
        <label class="ml-1 md:text-xl"
        :for="id">
            <slot name="inputLabel"></slot>
        </label>
        <div class="relative w-full">
            <input
                class="p-2 w-full border-2 appearance-none border-[#cbcfc3] dark:bg-[#13203a] dark:border-[#13203a] bg-[#cbcfc3] hover:bg-[#afb2a8] dark:hover:bg-[#1e325b] dark:hover:border-[#1e325b] hover:border-[#afb2a8] focus:border-[#419400] dark:focus:border-[#3abdf7] user-invalid:border-[#f83a57] dark:user-invalid:border-[#fb7085] rounded-xl outline-0 transition-colors duration-100 md:text-xl lg:p-3"
                :id="id"
                :name="name"
                :type="computedType"
                :value="modelValue"
                :placeholder="placeholder"
                :required="required"
                :min="min"
                :max="max"
                :pattern="pattern"
                :step="step"
                :minlength="minlength"
                :maxlength="maxlength"
                :autocomplete="autocomplete"
                @input="onInput"
                />
    
            <div v-if="props.type === 'password'" class="absolute right-3 top-0 h-full flex items-center">
                <button class="bg-[#343300] hover:bg-[#bdc000] active:bg-[#419400] dark:bg-[#cdd0d4] dark:hover:bg-[#3abdf7] dark:active:bg-[#818cf8] duration-100 w-5 h-5 rounded-2xl cursor-pointer" type="button" @mousedown="showPassword = true" @mouseup="showPassword = false" @mouseleave="showPassword = false" @touchstart="showPassword = true" @touchend="showPassword = false" @touchcancel="showPassword = false">

                </button>
            </div>
        </div>

        <p class="text-[#fb7085] ml-2 my-2" v-if="$slots.inputError"><slot name="inputError"></slot></p>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';


    const props = defineProps<{
        modelValue?: string
        id?: string
        name?: string
        type?: string
        placeholder?: string
        required?: boolean
        min?: number | string
        max?: number | string
        pattern?: string
        step?: number | string
        minlength?: number | string
        maxlength?: number | string
        autocomplete?: string
        }>()
    
    const showPassword = ref(false)

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void
        (e: 'validation', message: string): void
    }>()


    const onInput = (e: Event) => {
        const input = e.target as HTMLInputElement
        emit('update:modelValue', input.value)
        
        if (input.validity.valueMissing) {
            emit('validation', 'Заполните это поле.')
        } else if (input.validity.tooShort) {
            emit('validation', `Минимум ${props.minlength} символов(-а)`)
        } else if (input.validity.tooLong) {
            emit('validation', `Максимум ${props.maxlength} символов`)
        } else if (input.validity.patternMismatch && props.type === 'password') {
            emit('validation', 'Пароль должен содержать цифру, строчную и заглавную букву')
        } else if (input.validity.rangeUnderflow) {
            emit('validation', `Слишком маленькое значение. Минимум ${props.min}`)
        } else if (input.validity.rangeOverflow) {
            emit('validation', `Слишком большое значение. Максмум ${props.max}`)
        } else if (input.validity.typeMismatch) {
            emit('validation', input.validationMessage)
        } else if (input.validity.stepMismatch) {
            emit('validation', `Слишком много знаков после запятой. Следуйте шаблону: ${props.step}`)
        } else {
            emit('validation', '')
        }
    }

    const computedType = computed(() => {
        if (props.type !== 'password') {
            return props.type
        }
        
        return showPassword.value ? 'text' : 'password';
    })
</script>

