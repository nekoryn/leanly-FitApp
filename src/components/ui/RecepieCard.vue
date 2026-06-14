<template>
    <div
        class="border-[#cbcfc3] dark:border-[#1e293b] relative border-4 w-80 h-80 md:w-60 md:h-60 lg:w-55 lg:h-55 mx-auto rounded-2xl overflow-hidden group transition-colors duration-100">

        <img :src="imageSrc" :alt="title"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-400" />

        <div class="absolute inset-0 bg-linear-to-t from-[#151614]/90 via-[#151614]/40 to-transparent h-full"></div>

        <div class="absolute bottom-0 left-0 p-4 pr-36 md:pr-24 lg:pr-28 text-white w-full">
            <h3 class="font-bold text-base md:text-sm lg:text-xs line-clamp-2 leading-tight" :title="title">
                {{ title }}
            </h3>
        </div>

        <div class="flex absolute bottom-0 right-0 w-fit p-4 gap-2 items-center z-10">
            <button
                class="bg-[#419400] dark:bg-[#3abdf7] text-white hover:bg-[#347500] dark:hover:bg-[#59ccfe] cursor-pointer active:scale-95 duration-100 w-9 h-9 md:w-8 md:h-8 rounded-full font-bold flex items-center justify-center"
                type="button" @click.stop="$emit('add', id)">
                +
            </button>

            <button
                class="text-white hover:text-[#419400] dark:hover:text-[#59ccfe] cursor-pointer font-medium duration-100 text-sm md:text-xs"
                type="button" @click.stop="$emit('open', id)">
                Открыть
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    id: number | string     
    title: string           
    imageSrc: string       
}>()


defineEmits<{
    (e: 'add', id: number | string): void   
    (e: 'open', id: number | string): void
}>()
</script>