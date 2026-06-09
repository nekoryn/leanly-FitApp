<script setup lang="ts">
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
    } from 'chart.js'

    import { Line } from 'vue-chartjs'
    import { computed, watchEffect } from 'vue';
    import { ref } from 'vue';

    ChartJS.register(
        Title,
        Tooltip,
        Legend,
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale
    )

    const isDark = ref(false)


    watchEffect(() => {
        isDark.value = document.documentElement.classList.contains('dark')
    })

    const props = defineProps<{
        labels: string[]
        data: number[]
        datasetLabel: string
    }>()

    const chartData = computed(() => ({
        labels: props.labels,

        datasets: [
            {
                label: props.datasetLabel,
                data: props.data,
                tension: 0.3,

                borderColor: isDark.value ? '#c9cbd0' : '#151614',
                backgroundColor: isDark.value ? '#c9cbd0' : '#151614',
                pointBackgroundColor: isDark.value ? '#c9cbd0' : '#151614',
                pointBorderColor: isDark.value ? '#c9cbd0' : '#151614',
            }
        ]
    }))

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                labels: {
                    color: isDark.value ? '#c9cbd0' : '#151614'
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: isDark.value ? '#c9cbd0' : '#151614'
                },
                grid: {
                    color: isDark.value ? '#c9cbd0' : '#151614'
                }
            },

            y: {
                ticks: {
                    color: isDark.value ? '#c9cbd0' : '#151614'
                }, 
                grid: {
                    color: isDark.value ? '#c9cbd0' : '#151614'
                }
            }
        }
    }
    const chartWidth = computed(() => {
        const points = props.labels?.length
        const calculatedWidth = points * 60

        return {
            width: `${calculatedWidth}px`
        }
    })
</script>

<template>
    <div class="overflow-x-scroll">
        <div class='h-80 min-w-full' :style="chartWidth">
            <Line
                :data="chartData"
                :options="chartOptions"></Line>
        </div>
    </div>
</template>