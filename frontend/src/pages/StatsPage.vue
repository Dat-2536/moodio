<script setup>
import { Activity, ShieldCheck, Zap, BarChart3 } from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import AppCard from '@/components/common/AppCard.vue'

const stats = [
  { label: 'Total Scans', value: '1,284', icon: Activity },
  { label: 'Avg Accuracy', value: '94.2%', icon: ShieldCheck },
  { label: 'Latency', value: '12ms', icon: Zap }
]
</script>

<template>
  <section class="service-page">
    <PageHeader 
      title="Analytics Dashboard" 
      subtitle="Tổng quan hiệu năng và dữ liệu nhận diện của hệ thống."
    />

    <div class="stats-grid">
      <AppCard v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-icon">
          <component :is="s.icon" :size="20" />
        </div>
        <div class="stat-content">
          <span class="stat-label">{{ s.label }}</span>
          <span class="stat-value">{{ s.value }}</span>
        </div>
      </AppCard>
    </div>

    <AppCard class="chart-container">
      <div class="chart-header">
          <h3>Detection Trends</h3>
          <div class="chart-filters">
            <button class="filter-btn active">Week</button>
            <button class="filter-btn">Month</button>
          </div>
      </div>
      <div class="chart-placeholder">
          <BarChart3 :size="48" class="faint-icon" />
          <p>Dữ liệu đang được tổng hợp...</p>
      </div>
    </AppCard>
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
  background: var(--primary);
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

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.faint-icon { 
  opacity: 0.2; 
  margin-bottom: 1rem; 
}

@media (max-width: 1100px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; gap: 1.5rem; }
}
</style>
