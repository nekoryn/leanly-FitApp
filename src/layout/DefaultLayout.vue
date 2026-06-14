<script setup lang="ts">
    import AppHeader from '@/components/layouts/AppHeader.vue';
    import AppFooter from '@/components/layouts/AppFooter.vue';
</script>

<template>
    <AppHeader>

    </AppHeader>
    <main class="flex flex-col items-center min-h-dvh justify-center mt-40 mb-40 md:mt-60 md:mb-60">
        <slot></slot>
    </main>
    <AppFooter>
        
    </AppFooter>
</template>