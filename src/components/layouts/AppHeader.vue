<template>
    <header class="bg-[#f8fdef] dark:bg-[#0a1120] mt-3 h-20 rounded-2xl md:h-25 lg:h-30 transition-colors duration-100">
        <div class="flex h-full w-85 mx-auto items-center justify-between gap-4 md:w-184.5 lg:w-250">
            <RouterLink to="/" class="text-xl font-black text-[#419400] dark:text-[#3abdf7] hover:text-[#bdc000] dark:hover:text-[#818cf8] dark:active:text-[#cdd0d4] active:text-[#343300] transition-colors duration-100 md:text-3xl lg:text-4xl">Leanly</RouterLink>
            <nav id="navbar" class="fixed w-60 h-screen text-2xl top-0 right-0 bg-[#cbcfc3] dark:bg-[#0f172a] rounded-l-2xl transition-all duration-100 ease-in-out md:relative md:flex md:flex-1 md:items-center md:w-fit md:h-fit md:translate-x-0 dark:md:bg-[#00000000] md:bg-[#00000000] md:text-xl"
            :class="isOpen ? 'translate-x-0 right-0' : 'translate-x-full'">
                <button @click="toggleMenu" class="flex top-8.5 left-47.5 relative w-10 h-10 items-center group right-0 cursor-pointer md:hidden">
                    <span class="absolute rotate-45 w-10 rounded-xl h-1.5 bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                    <span class="absolute -rotate-45 w-10 rounded-xl h-1.5 bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                </button>
    
                <div v-if="auth.isAuthChecked && auth.user" class="flex flex-col gap-5 mt-20 ml-4 md:mt-0 md:mx-auto md:flex-row">
                    <HeaderNavLink to="/">Dashboard</HeaderNavLink>
                    <HeaderNavLink to="/meals-diary">Meals Diary</HeaderNavLink>
                    <HeaderNavLink to="/profile">Profile</HeaderNavLink>
                    <HeaderNavLink to="/graphs">Graphs</HeaderNavLink>
                    <HeaderNavLink to="/recepies">Recepies</HeaderNavLink>
                </div>

                <button @click="toggleTheme" class="flex ml-4 mt-40 group items-center justify-center bg-[#00000000] hover:bg-[#e1e6d9] dark:hover:bg-[#13203a] active:bg-[#afb4a6] transition-colors duration-100 cursor-pointer rounded-3xl w-12 h-12 md:mt-0"
                :class="!(auth.isAuthChecked && auth.user) ? 'md:ml-auto' : 'md:ml-0'">
                    <svg
                        class="w-8 h-8 dark:text-[#cdd0d4] text-[#343300] dark:group-hover:text-[#eef5fe] group-hover:text-[#50504d] dark:group-active:text-[#818cf8] group-active:text-[#edd000] transition-colors duration-100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        >
                        <circle cx="12" cy="12" r="5" fill="currentColor"></circle>

                        <line x1="12" y1="1" x2="12" y2="4"></line>
                        <line x1="12" y1="20" x2="12" y2="23"></line>

                        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"></line>
                        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"></line>

                        <line x1="1" y1="12" x2="4" y2="12"></line>
                        <line x1="20" y1="12" x2="23" y2="12"></line>

                        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"></line>
                        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"></line>
                    </svg>
                </button>
            </nav>
    
            <button @click="toggleMenu" id="burgerBtn" class="w-10 h-10 flex flex-col gap-1 justify-center cursor-pointer group md:hidden">
                <span class="block w-10 h-1.5 rounded-xl bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                <span class="block w-10 h-1.5 rounded-xl bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
                <span class="block w-10 h-1.5 rounded-xl bg-[#343300] dark:bg-[#cdd0d4] group-active:bg-[#419400] dark:group-active:bg-[#818cf8] transition-colors duration-100"></span>
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authstore';
import { chartKey } from '@/keys/chartKey';
import HeaderNavLink from '../ui/HeaderNavLink.vue';

const auth = useAuthStore();


const isOpen = ref(false);
const isDark = ref(false);

onMounted(async () => {
    isDark.value =
        document.documentElement.classList.contains('dark');
});


function toggleMenu() {
    isOpen.value = !isOpen.value;
}
function toggleTheme() {
    isDark.value = !isDark.value;

    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }

    chartKey.value++

}
</script>