<script setup>
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    duration: 800,
    once: false,
    mirror: true
  })
})
</script>

<template>
  <MainLayout />
</template>

<style>
/* Global styles that were in App.vue scoped but might be needed globally */
.mt-12 { margin-top: 3rem; }
.text-left { text-align: left; }
.font-bold { font-weight: 700; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
</style>
