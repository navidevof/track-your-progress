<template>
  <SectionContainer v-show="topSet">
    <h2 class="font-semibold text-lg">Progreso Reciente:</h2>
    <div class="justify-between flex items-center text-sm font-medium">
      <span>
        {{ topSet?.weight }} {{ topSet?.weightUnit }} x {{ topSet?.reps }} Reps
      </span>
      <span>
        {{ topSet?.date }}
      </span>
    </div>
  </SectionContainer>
</template>

<script setup lang="ts">
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import { useProgressStore } from "@/stores/progress";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const progressStore = useProgressStore();

const topSet = computed(() => {
  const exerciseId = route.params.exerciseId as string;
  if (!exerciseId) return null;

  const routine = progressStore.findLastExerciseRecord(exerciseId);

  const topSet = routine?.exercise.series
    .sort((a, b) => b.weight - a.weight)
    .sort((a, b) => {
      return b.reps - a.reps;
    })[0];

  if (!topSet || topSet?.reps === 0) return null;

  return {
    date: routine?.date,
    ...topSet,
  };
});
</script>
