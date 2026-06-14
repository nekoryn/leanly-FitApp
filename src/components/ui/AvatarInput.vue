<script setup lang="ts">
import { useAuthStore } from '@/stores/authstore';
import { computed, ref } from 'vue';

defineProps<{
    modelValue: File | null
}>()

const auth = useAuthStore()
const AVATAR_BASE_URL = import.meta.env.VITE_AVATAR_BASE_URL

const avatarUrl = computed(() => {
    const isDark = localStorage.getItem('theme') === 'dark' ? true : false
    if (auth.user?.user_avatar === ' ') {
        return isDark
            ? `${AVATAR_BASE_URL}/uploads/avatars/dark_default_avatar.webp`
            : `${AVATAR_BASE_URL}/uploads/avatars/default_avatar.webp`;
    }
    return `${AVATAR_BASE_URL}/uploads/avatars/${auth.user?.user_avatar}`;
});

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

<template>
    <div class="w-full flex flex-col items-center gap-3 dark:text-[#c9cbd0]">
        <label class="w-full text-left ml-1 md:text-xl">Аватар профиля</label>

        <input type="file" accept="image/*" class="hidden" id="avatar-input" @change="onFileSelect" />

        <div v-if="previewUrl || auth.user?.user_avatar" class="relative group w-60 h-60">
            <img :src="previewUrl ? previewUrl : avatarUrl" alt="Preview"
                class="w-full h-full rounded-full object-cover border-2 border-[#419400] dark:border-[#3abdf7] shadow-md" />

            <label for="avatar-input"
                class="absolute inset-0 w-full h-full rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer flex flex-col items-center justify-center text-white text-xs md:text-sm font-medium text-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-5 h-5 mb-1">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
                Изменить фото
            </label>
        </div>

        <div v-else @dragover.prevent @dragenter.prevent="onDragEnter" @dragleave.prevent="onDragLeave"
            @drop.prevent="onFileDrop" :class="[
                'relative w-full h-60 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-200 overflow-hidden',
                isDragActive
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5'
                    : 'border-[#cbcfc3] bg-transparent hover:bg-gray-50 dark:border-[#13203a] dark:hover:bg-[#13203a]/50'
            ]">
            <label for="avatar-input"
                class="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center p-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-8 h-8 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <p class="text-sm md:text-base">
                    <span class="font-semibold text-[#419400] dark:text-[#3abdf7]">Кликните</span> или перетащите аватар сюда
                </p>
                <p class="text-xs text-gray-400">PNG, JPG, WEBP до 5MB</p>
            </label>
        </div>
    </div>
</template>