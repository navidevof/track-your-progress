<template>
  <main
    class="container mx-auto w-5/6 max-w-xl py-8 flex flex-col gap-y-6 relative min-h-screen"
  >
    <ButtonBack v-show="showBackButton" />
    <h1 v-if="title" class="text-xl font-bold text-start md:text-2xl">
      {{ title }}
    </h1>
    <slot />
  </main>
</template>

<script setup lang="ts">
import ButtonBack from "../buttons/ButtonBack.vue";

interface Props {
  title?: string;
  showBackButton?: boolean;
}

defineProps<Props>();
</script>
