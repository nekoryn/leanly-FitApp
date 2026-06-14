<template>
    <div class="flex flex-col w-full items-center gap-3 md:w-70 lg:w-80 dark:text-[#c9cbd0]">
        <label class="w-full text-left ml-1 text-sm md:text-base lg:text-xl font-medium">Фотография блюда</label>

        <input 
            type="file" 
            accept="image/*" 
            class="hidden" 
            id="recipeImg-input" 
            @change="onFileSelect" 
        />

        <div v-if="previewUrl" class="relative group w-50 h-50 md:w-70 md:h-70 lg:w-80 lg:h-80">
            <img 
                :src="previewUrl" 
                alt="Preview"
                class="w-full h-full rounded-2xl object-cover border-2 border-[#419400] dark:border-[#3abdf7] shadow-md" 
            />

            <label 
                for="recipeImg-input"
                class="absolute inset-0 w-full h-full rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex flex-col items-center justify-center text-white text-xs md:text-sm font-medium text-center p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mb-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                Изменить фото
            </label>
        </div>

        <div 
            v-else 
            @dragover.prevent 
            @dragenter.prevent="onDragEnter" 
            @dragleave.prevent="onDragLeave"
            @drop.prevent="onFileDrop" 
            :class="[
                'relative w-50 h-50 md:w-70 md:h-70 lg:w-80 lg:h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200 overflow-hidden',
                isDragActive
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5'
                    : 'border-[#cbcfc3] bg-transparent hover:bg-gray-50 dark:border-[#13203a] dark:hover:bg-[#13203a]/50'
            ]"
        >
            <label 
                for="recipeImg-input"
                class="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center p-4 text-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400 mb-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <p class="text-xs md:text-sm lg:text-base px-2">
                    <span class="font-semibold text-[#419400] dark:text-[#3abdf7]">Кликните</span> или перетащите фото
                </p>
                <p class="text-[10px] md:text-xs text-gray-400 mt-1">PNG, JPG, WEBP до 5MB</p>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    modelValue: File | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', file: File | null): void
}>();

const isDragActive = ref(false);
const previewUrl = ref<string | null>(null);

function onDragEnter() { isDragActive.value = true; }
function onDragLeave() { isDragActive.value = false; }

function onFileDrop(event: DragEvent) {
    isDragActive.value = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0 && files[0]) {
        processFile(files[0]);
    }
}

function onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0 && files[0]) {
        processFile(files[0]);
    }
}

function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
    }
    previewUrl.value = URL.createObjectURL(file);
    emit('update:modelValue', file);
}
</script>