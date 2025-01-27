<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-custom-black-2/50 backdrop-blur-md"
  >
    <aside
      class="flex flex-col md:w-auto w-5/6 bg-custom-black-2 p-4 rounded-lg border border-custom-gray-1"
    >
      <header class="flex justify-end">
        <button
          class="text-custom-white-1 hover:text-custom-gray-4 transition-colors"
          @click="emit('close')"
        >
          <IconX class="size-4" />
        </button>
      </header>
      <slot />
    </aside>
  </div>
</template>

<script setup lang="ts">
import IconX from "@/components/icons/IconX.vue";

const emit = defineEmits(["close"]);
</script>
