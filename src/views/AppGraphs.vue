<script setup lang="ts">
    import DefaultLayout from '@/layout/DefaultLayout.vue';
    import { ref, onMounted, computed } from 'vue';
    import { chartKey } from '@/keys/chartKey';
    import DefaultSection from '@/components/ui/DefaultSection.vue';
    import DefaultChart from '@/components/charts/DefaultChart.vue';
    import { loadStatsHistory } from '@/api/statsApi';
    import type { stepsHistory } from '@/types/stepsHistory';
    import WeightChart from '@/components/charts/WeightChart.vue';

    const steps = ref<stepsHistory[]>([])

    onMounted(async () => {
        steps.value = await loadStatsHistory()
        console.log(steps.value)
        console.log(chartLabels, chartValues)
    })

    const chartLabels = computed(() =>
        steps?.value.map(item => new Date(item.summary_date).toLocaleDateString())
    )

    const chartValues = computed(() =>
        steps?.value.map(item => item.steps)
    )    
</script>

<template>
    <DefaultLayout>
        <WeightChart>

        </WeightChart>
        <DefaultSection>
            <template #h2Header>
                График шагов
            </template>
            <template #mainContent>
                <DefaultChart :labels="chartLabels" :data="chartValues" dataset-label="Шаги" :key="chartKey">
    
                </DefaultChart>
            </template>
        </DefaultSection>
    </DefaultLayout>
</template>