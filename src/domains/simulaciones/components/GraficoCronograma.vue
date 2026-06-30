<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, Title, Tooltip, Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

const props = defineProps({ cronograma: { type: Array, default: () => [] } })

const chartData = computed(() => ({
  labels: props.cronograma.map(f => `C${f.nro_cuota}`),
  datasets: [
    {
      label: 'Amortización',
      data: props.cronograma.map(f => parseFloat(f.amortizacion)),
      backgroundColor: '#1e3a5f',
      stack: 'cuota',
    },
    {
      label: 'Interés',
      data: props.cronograma.map(f => parseFloat(f.interes)),
      backgroundColor: '#e8b84b',
      stack: 'cuota',
    },
    {
      label: 'Seguros + Portes',
      data: props.cronograma.map(f =>
          parseFloat(f.seguro_vehicular) + parseFloat(f.seguro_desgravamen) + parseFloat(f.portes)
      ),
      backgroundColor: '#94a3b8',
      stack: 'cuota',
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: S/ ${ctx.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      ticks: {
        callback: (v) => 'S/ ' + v.toLocaleString('es-PE'),
      },
    },
  },
}
</script>

<style scoped>
.chart-wrapper { height: 320px; }
</style>