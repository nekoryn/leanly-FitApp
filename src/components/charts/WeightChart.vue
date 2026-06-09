<script setup lang="ts">
import { fetchWeightHistory } from '@/api/weightApi';
import { chartKey } from '@/keys/chartKey';
import { computed, onMounted } from 'vue';
import DefaultSection from '../ui/DefaultSection.vue';
import DefaultChart from './DefaultChart.vue';
import { weights } from '@/api/weightApi';



onMounted(async () => {
    weights.value = await fetchWeightHistory()
    console.log(weights.value)
})

const chartLabels = computed(() =>
    weights.value.map(item => new Date(item.created_at).toLocaleDateString())
)

const chartValues = computed(() =>
    weights.value.map(item => item.weight)
)

</script>

<template>
    <DefaultSection>
        <template #h2Header>
            График веса
        </template>
        <template #mainContent>
            <DefaultChart :labels="chartLabels" :data="chartValues" dataset-label="Вес (кг)" :key="chartKey">
            </DefaultChart>
        </template>
    </DefaultSection>
</template>