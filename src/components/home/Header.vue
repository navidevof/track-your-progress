<template>
  <header class="w-full flex flex-col gap-y-3">
    <div class="w-full flex justify-end items-center">
      <input
        type="date"
        class="ml-1 text-white font-medium"
        v-model="selectedDate"
        @input="progressStore.findRoutine"
      />
    </div>
    <SelectDay />
  </header>
</template>

<script setup lang="ts">
import { useProgressStore } from "@/stores/progress";
import { storeToRefs } from "pinia";
import SelectDay from "./SelectDay.vue";

const progressStore = useProgressStore();
const { selectedDate } = storeToRefs(progressStore);
</script>
