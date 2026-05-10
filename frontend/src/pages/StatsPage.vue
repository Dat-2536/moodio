<script setup>
import { ref, onMounted, computed } from 'vue'
import { Activity, ShieldCheck, Zap, BarChart3, AlertCircle, RefreshCw } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppCard from '@/components/common/AppCard.vue'
import AppButton from '@/components/common/AppButton.vue'

import { API_BASE } from '@/api/config'

const selectedRange = ref('week')
const isLoading = ref(true)
const connectionError = ref(false)
const dashboardData = ref({
  total_scans: 0,
  avg_confidence: 0,
  avg_latency_ms: 0,
  trend: [],
  emotion_distribution: []
})

const fetchStats = async () => {
  isLoading.value = true
  connectionError.value = false
  try {
    const response = await fetch(`${API_BASE}/stats/dashboard?range=${selectedRange.value}`)
    if (!response.ok) throw new Error('API Error')
    dashboardData.value = await response.json()
  } catch (err) {
    connectionError.value = true
    console.warn('Could not fetch real-time stats, using local defaults.')
  } finally {
    isLoading.value = false
  }
}

const changeRange = (range) => {
  if (selectedRange.value === range) return
  selectedRange.value = range
  fetchStats()
}

onMounted(() => {
  fetchStats()
})

const maxScans = computed(() => {
  if (!dashboardData.value.trend.length) return 1
  return Math.max(...dashboardData.value.trend.map(d => d.scans), 1)
})

const statsCards = computed(() => [
  { 
    label: 'Total Scans', 
    value: dashboardData.value.total_scans.toLocaleString(), 
    icon: Activity,
    color: '#76B900'
  },
  { 
    label: 'Average Confidence', 
    value: dashboardData.value.total_scans > 0 ? `${(dashboardData.value.avg_confidence * 100).toFixed(1)}%` : '0%', 
    icon: ShieldCheck,
    color: '#76B900',
    sublabel: 'Based on model score'
  },
  { 
    label: 'Average Latency', 
    value: dashboardData.value.total_scans > 0 ? `${Math.round(dashboardData.value.avg_latency_ms)}ms` : '0ms', 
    icon: Zap,
    color: '#76B900'
  }
])
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Analytics Dashboard" 
      subtitle="Thống kê hiệu năng thực tế của hệ thống nhận diện cảm xúc Moodio."
    >
      <template #right>
        <div v-if="connectionError" class="connection-warning glass">
           <AlertCircle :size="14" />
           <span>Offline Mode</span>
           <button @click="fetchStats" class="sync-btn" title="Sync Data">
              <RefreshCw :size="12" :class="{ 'spin': isLoading }" />
           </button>
        </div>
      </template>
    </PageHeader>

    <div class="stats-grid">
      <AppCard v-for="s in statsCards" :key="s.label" class="stat-card">
        <div class="stat-icon" :style="{ backgroundColor: s.color }">
          <component :is="s.icon" :size="20" />
        </div>
        <div class="stat-content">
          <span class="stat-label">{{ s.label }}</span>
          <span class="stat-value">{{ isLoading && !dashboardData.total_scans ? '---' : s.value }}</span>
          <span v-if="s.sublabel" class="stat-sublabel">{{ s.sublabel }}</span>
        </div>
      </AppCard>
    </div>

    <AppCard class="chart-container">
      <div class="chart-header">
          <h3>Detection Trends</h3>
          <div class="chart-filters">
            <button 
              :class="['filter-btn', { active: selectedRange === 'week' }]"
              @click="changeRange('week')"
            >Week</button>
            <button 
              :class="['filter-btn', { active: selectedRange === 'month' }]"
              @click="changeRange('month')"
            >Month</button>
          </div>
      </div>

      <div v-if="isLoading && !dashboardData.trend.length" class="chart-loading">
        <div class="loader"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="!dashboardData.trend.length || dashboardData.total_scans === 0" class="chart-empty">
        <BarChart3 :size="48" class="faint-icon" />
        <p>Chưa có dữ liệu nhận diện để hiển thị.</p>
        <AppButton 
          v-if="connectionError" 
          variant="outline" 
          class="mt-6"
          @click="fetchStats"
        >
          Kết nối lại
        </AppButton>
      </div>

      <div v-else class="chart-wrapper app-scrollbar">
        <div class="bar-chart">
          <div 
            v-for="day in dashboardData.trend" 
            :key="day.date" 
            class="bar-item"
            :title="`${day.date}: ${day.scans} scans`"
          >
            <div class="bar-column">
              <div 
                class="bar-fill" 
                :style="{ height: `${(day.scans / maxScans) * 100}%` }"
              >
                <span v-if="day.scans > 0" class="bar-tooltip">{{ day.scans }}</span>
              </div>
            </div>
            <span class="bar-label">{{ day.label }}</span>
          </div>
        </div>
      </div>
    </AppCard>
    
    <div v-if="dashboardData.emotion_distribution.length > 0" class="distribution-grid mt-12">
       <AppCard class="p-8">
          <h3 class="mb-6 font-bold uppercase tracking-wider text-xs text-primary">Top Detected Emotions</h3>
          <div class="dist-list">
             <div v-for="item in dashboardData.emotion_distribution" :key="item.emotion" class="dist-item">
                <div class="dist-info">
                   <span class="dist-name">{{ item.emotion }}</span>
                   <span class="dist-count">{{ item.count }}</span>
                </div>
                <div class="dist-track">
                   <div class="dist-fill" :style="{ width: `${(item.count / dashboardData.total_scans) * 100}%` }"></div>
                </div>
             </div>
          </div>
       </AppCard>
    </div>
  </section>
</template>

<style scoped>
.service-page {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.connection-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.sync-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
}

.spin { animation: spin 1s linear infinite; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-label { 
  display: block; 
  font-size: 0.9rem; 
  color: var(--text-secondary); 
}

.stat-value { 
  display: block; 
  font-size: 1.8rem; 
  font-weight: 800; 
}

.stat-sublabel {
  font-size: 0.7rem;
  opacity: 0.6;
}

.chart-container {
  padding: 2.5rem;
  margin-top: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.chart-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.4rem 1rem;
  background: transparent;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

/* Bar Chart Styles */
.chart-wrapper {
  overflow-x: auto;
  padding-bottom: 1rem;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  height: 250px;
  min-width: 600px;
  padding-top: 2rem;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-column {
  flex: 1;
  width: 100%;
  max-width: 40px;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.bar-fill {
  width: 100%;
  background: var(--primary);
  border-radius: 6px 6px 0 0;
  transition: height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  min-height: 2px;
}

.bar-tooltip {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 800;
  color: var(--primary);
}

.bar-label {
  margin-top: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.chart-loading, .chart-empty {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.loader {
  border: 3px solid rgba(var(--primary-rgb), 0.1);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.faint-icon { 
  opacity: 0.2; 
  margin-bottom: 1rem; 
}

/* Distribution Styles */
.dist-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dist-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dist-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 700;
}

.dist-track {
  height: 8px;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.dist-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
}

.mt-6 { margin-top: 1.5rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-12 { margin-top: 3rem; }

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .bar-chart { min-width: 400px; gap: 0.8rem; }
}
</style>
