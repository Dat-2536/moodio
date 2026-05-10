<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<template>
  <div class="page-header">
    <div>
      <h2 class="page-title">{{ title }}</h2>
      <p class="page-subtitle">{{ subtitle }}</p>
    </div>
    <div class="header-right">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 3.5rem;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 0.75rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: 2.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .page-title {
    font-size: 2.2rem;
  }
}
</style>
