<template>
    <RouterLink class="p-2 rounded-xl transition-colors duration-100" :to="to"
        :class="isActive ? 'bg-[#419400] dark:bg-[#3abdf7] hover:bg-[#53be00] active:bg-[#4bae00] dark:hover:bg-[#59ccfe] dark:active:bg-[#0ab4fc] dark:text-[#010d15] hover:shadow-[0_0_20px_#53be00] active:shadow-[0_0_20px_#53be00] dark:hover:shadow-[0_0_20px_#59ccfe] dark:active:shadow-[0_0_20px_#59ccfe]' : 'hover:bg-[#e1e6d9] dark:hover:bg-[#1e325b]'">
        <slot>

        </slot>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
    to: string
}>()

const route = useRoute()

const isActive = computed(() => 
    route.path === props.to
)
</script>