<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-custom-black-2/50 backdrop-blur-md"
  >
    <aside
      :class="`${className} flex flex-col md:w-auto w-5/6 max-h-[90vh] bg-custom-black-2 overflow-y-auto p-4 rounded-lg border border-custom-gray-1`"
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

interface Props {
  className?: string;
}

defineProps<Props>();
const emit = defineEmits(["close"]);
</script>
