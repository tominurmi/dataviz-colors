<template>
  <div>
    <div class="flex items-center justify-center mt-32">
      <h1 class="mb-0">Fabric colors for dataviz</h1>
    </div>
    <section class="m-16 lg:m-64 md:grid gap-y-48 gap-x-32 color-grid">
      <template v-for="palette in paletteList" :key="palette.name">
        <h1 class="h4 lg:h3 text-right md:self-center">{{ palette.name }}</h1>
        <div class="w-full grid md:grid-cols-4 lg:grid-cols-8 gap-8">
          <swatch v-for="c in palette.colors" :group="palette.colors" :group-title="palette.name" :key="c.hex" :hex="c.hex" :weight="c.weight" :name="c.name"  />
        </div>
      </template>
    </section>
    <transition name="slide-full">
      <div v-if="wcag.hex" class="fixed flex items-center justify-between p-16 overflow-hidden w-full bottom-0" :style="{ backgroundColor: wcag.hex, color: wcag.text, borderColor: wcag.text }">
        <p class="h5 md:h3 mb-0">Showing WCAG ratings versus {{ wcag.name }}</p>
        <button @click="clearWcag" class="py-4 px-8 h5 md:h4 hover:underline rounded-4" :style="{ backgroundColor: wcag.text, color: wcag.hex }">Clear</button>
      </div>
    </transition>
  </div>
</template>

<script>
import Swatch from './components/Swatch.vue'
import { ref, computed, provide, watch } from 'vue'
import paletteList from './colors'

export default {
  name: 'App',
  components: { Swatch },
  setup() {
    const wcag = ref('')

    provide('wcag', wcag)
    const clearWcag = () => wcag.value = {}

    return { paletteList, wcag, clearWcag }
  }
}
</script>

<style>
.dark {
  background-color: var(--f-gray-800);
  color: var(--f-gray-50);
}
</style>

<style scoped>
.color-grid {
  grid-template-columns: max-content 1fr;
}
@media (max-width: 990px) {
  .color-grid {
    grid-template-columns: min-content 1fr;
  }
}
.slide-full-enter-active,
.slide-full-leave-active {
  transition: transform 0.3s ease;
}
.slide-full-enter-from,
.slide-full-leave-to {
  transform: translateY(100%);
}
</style>
