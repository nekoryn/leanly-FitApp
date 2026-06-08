<template>
    <AppHeader noRoundedBottom>

    </AppHeader>
    <div class="flex flex-col min-h-dvh lg:flex-row lg:w-5xl lg:mx-auto lg:gap-1">
        <SettingsNavbar>
            <div class="flex flex-col gap-2">
                <SettingsLinkButton to="/settings/profile">
                    Настройки Профиля
                </SettingsLinkButton>
                <SettingsLinkButton to="/settings/security">
                    Настройки безопасности
                </SettingsLinkButton>
                <SettingsLinkButton to="/settings/appearance">
                    Настройки отображения
                </SettingsLinkButton>
            </div>
        </SettingsNavbar>
        <main class="w-90 min-h-100 h-fit dark:bg-[#0a1120] dark:text-[#c9cbd0] bg-[#f8fdef] p-4 my-1 rounded-2xl mx-auto md:w-3xl lg:flex-1 lg:rounded-tl-none transition-colors duration-100">
            <slot></slot>
        </main>
    </div>
    <AppFooter>

    </AppFooter>
</template>

<script setup lang="ts">
import AppFooter from '@/components/layouts/AppFooter.vue';
import AppHeader from '@/components/layouts/AppHeader.vue';
import SettingsNavbar from '@/components/layouts/SettingsNavbar.vue';
import SettingsLinkButton from '@/components/ui/SettingsLinkButton.vue';
</script>