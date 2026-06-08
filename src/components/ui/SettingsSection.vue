<template>
    <div class="flex justify-between border border-[#cbcfc3] dark:border-[#1e293b] rounded-2xl items-center p-2 transition-colors duration-100">
        <p class="md:text-xl">
            <slot name="text">
    
            </slot>
        </p>
        <slot name="action">

        </slot>
    </div>
</template>