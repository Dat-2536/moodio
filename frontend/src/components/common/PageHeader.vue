<script setup>
defineProps({
  title: String,
  subtitle: String,
  compact: Boolean
})
</script>

<template>
  <div class="page-header" :class="{ compact }">
    <div class="header-content">
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

.page-header.compact {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: clamp(2.2rem, 5vw, 2.8rem);
  font-weight: 900;
  margin-bottom: 0.75rem;
  line-height: 1.1;
}

.page-header.compact .page-title {
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 800px;
}

.page-header.compact .page-subtitle {
  font-size: 0.95rem;
  max-width: 720px;
}

@media (max-width: 768px) {
  .page-header {
    margin-bottom: 2.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .page-header.compact {
    margin-bottom: 1.5rem;
    gap: 0.75rem;
  }
  .page-title {
    font-size: 2.2rem;
  }
}
</style>
