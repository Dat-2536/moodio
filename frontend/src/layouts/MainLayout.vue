<script setup>
import { useRoute } from 'vue-router'
import { watch, nextTick } from 'vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground.vue'
import AOS from 'aos'

const route = useRoute()

watch(() => route.path, () => {
  nextTick(() => {
    AOS.refresh()
  })
})
</script>

<template>
  <div class="app-wrapper">
    <NeuralNetworkBackground v-if="route.path === '/home' || route.path === '/'" />
    <div class="bg-dots"></div>
    <div class="bg-gradient"></div>
    
    <AppNavbar />

    <main class="main-container">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  padding-top: 1rem;
  padding-bottom: 3rem;
  flex: 1;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
