<template>
  <button
    @click="router.back()"
    type="button"
    class="text-custom-white-1 flex items-center w-fit gap-x-3"
  >
    <IconChevron class="size-4 min-w-4 mt-1" />
    Volver
  </button>
</template>

<script setup lang="ts">
import IconChevron from "@/components/icons/IconChevron.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
