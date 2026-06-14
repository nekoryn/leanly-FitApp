<script setup lang="ts">
    import AppHeader from '@/components/layouts/AppHeader.vue';
    import AppFooter from '@/components/layouts/AppFooter.vue';
</script>

<template>
    <div class="min-h-dvh grid grid-rows-[auto_1fr_auto] bg-[#e1e6d9] dark:bg-[#0a1120]">
        <AppHeader>
    
        </AppHeader>
        <main class="flex flex-col items-center justify-center mt-40 mb-40 md:mt-60 md:mb-60">
            <slot></slot>
        </main>
        <AppFooter>
            
        </AppFooter>
    </div>
</template>