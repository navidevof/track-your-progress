<template>
  <MainContainer>
    <h1 class="text-xl font-bold text-center md:text-2xl">
      Registra tu progreso
    </h1>
    <Header />
    <SectionContainer v-show="routine?.exercises?.length">
      <div
        class="flex items-center gap-x-3 relative"
        v-for="(exercise, idx) in routine?.exercises"
        :key="exercise.id"
      >
        <ButtonSecondary
          @click="router.push(`/ejercicio/${exercise.id}`)"
          type="button"
          class="flex-1 text-start"
          :class="[
            exercise.series.length > 0 &&
              exercise.series.every(
                (serie) => serie.reps > 0 && serie.weight > 0
              ) &&
              'line-through',
          ]"
        >
          {{ exercise.name }}
        </ButtonSecondary>
        <button @click="deleteExercise(idx)">
          <IconTrash class="size-5 min-w-4 text-custom-error/75" />
        </button>
      </div>
    </SectionContainer>
    <SectionContainer>
      <p class="text-center text-sm" v-show="!routine?.exercises?.length">
        Parece que no haz realizado ninguna rutina este dia. ¿Te gustaría
        registrar tu progreso?
      </p>
      <AddNewExercise />
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import AddNewExercise from "@/components/home/AddNewExercise.vue";
import Header from "@/components/home/Header.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import { useProgressStore } from "@/stores/progress";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const progressStore = useProgressStore();

const { routine } = storeToRefs(progressStore);

onMounted(() => {
  progressStore.findRoutine();
});

const deleteExercise = (idx: number) => {
  routine.value?.exercises.splice(idx, 1);
};
</script>
