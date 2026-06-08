<template>
    <header
        :class="['bg-[#f8fdef] dark:bg-[#0a1120] mt-3 h-20 rounded-t-2xl md:h-25 lg:h-30 transition-colors duration-100',
            !noRoundedBottom && 'rounded-b-2xl'
        ]">
        <div class="flex h-full w-85 mx-auto items-center justify-between gap-4 md:w-184.5 lg:w-250">
            <RouterLink to="/"
                class="text-xl font-black text-[#419400] dark:text-[#3abdf7] hover:text-[#bdc000] dark:hover:text-[#818cf8] dark:active:text-[#cdd0d4] active:text-[#343300] transition-colors duration-100 md:text-3xl lg:text-4xl">
                Leanly</RouterLink>
            <nav id="navbar"
                class="fixed w-60 h-screen z-2 text-2xl top-0 right-0 bg-[#cbcfc3] dark:bg-[#0f172a] rounded-l-2xl transition-all duration-100 ease-in-out md:relative md:flex md:flex-1 md:items-center md:w-fit md:h-fit md:translate-x-0 dark:md:bg-[#00000000] md:bg-[#00000000] md:text-xl"
                :class="isOpen ? 'translate-x-0 right-0' : 'translate-x-full'"
                ref="navRef">
                <button ref="burgerBtn" @click="toggleMenu"
                    class="flex top-8.5 left-47.5 relative w-10 h-10 items-center group right-0 cursor-pointer md:hidden">
                    <span
                        class="absolute rotate-45 w-10 rounded-xl h-1.5 bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                    <span
                        class="absolute -rotate-45 w-10 rounded-xl h-1.5 bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                </button>

                <div v-if="auth.isAuthChecked && auth.user"
                    class="flex flex-col gap-5 mt-20 ml-4 md:mt-0 md:mx-auto md:flex-row">
                    <HeaderNavLink to="/">Dashboard</HeaderNavLink>
                    <HeaderNavLink to="/meals-diary">Meals Diary</HeaderNavLink>
                    <HeaderNavLink to="/profile">Profile</HeaderNavLink>
                    <HeaderNavLink to="/graphs">Graphs</HeaderNavLink>
                    <HeaderNavLink to="/recepies">Recepies</HeaderNavLink>
                </div>

                <SettingsButton to="/settings/profile" v-if="auth.isAuthChecked && auth.user"
                    :class="!(auth.isAuthChecked && auth.user) ? 'md:ml-auto' : 'md:ml-0'">

                </SettingsButton>
            </nav>

            <button @click="toggleMenu" id="burgerBtn"
                class="w-10 h-10 flex flex-col gap-1 justify-center cursor-pointer group md:hidden">
                <span
                    class="block w-10 h-1.5 rounded-xl bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                <span
                    class="block w-10 h-1.5 rounded-xl bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                <span
                    class="block w-10 h-1.5 rounded-xl bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authstore';
import HeaderNavLink from '../ui/HeaderNavLink.vue';
import SettingsButton from '../ui/SettingsButton.vue';
import { onClickOutside } from '@vueuse/core';

const auth = useAuthStore();

const navRef = ref<HTMLElement | null>(null)

const isOpen = ref(false);

defineProps<{
    noRoundedBottom?: boolean
}>()

function toggleMenu() {
    isOpen.value = !isOpen.value;
}

onClickOutside(navRef, () => {
    isOpen.value = false
})

</script>