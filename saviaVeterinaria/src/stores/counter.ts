
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Store de ejemplo (contador) - Puede eliminarse si no se usa
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  // Getter: devuelve el doble del valor actual
  const doubleCount = computed(() => count.value * 2)
  // Action: incrementa el contador en 1
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
