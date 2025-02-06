<template>
  <MainContainer title="Registra tu progreso">
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
          <IconTrash
            class="size-5 min-w-4 transition hover:text-custom-error/75"
          />
        </button>
      </div>
      <AddNewExercise />
    </SectionContainer>
    <SectionContainer v-show="!routine?.exercises?.length">
      <div
        class="rounded-lg bg-custom-black-3/50 drop-shadow p-4 flex flex-col gap-y-3 justify-center items-center"
      >
        <div class="bg-custom-gray-1 rounded-full p-4">
          <IconCalendar class="size-8 min-w-8 text-white/75" />
        </div>
        <p class="text-center">
          Parece que no has realizado ninguna rutina este día.
        </p>
        <span class="text-white/75 mb-3 text-sm">
          ¿Te gustaría registrar tu progreso?
        </span>
      </div>
      <ButtonPrimary class="mx-auto">Asignar rutina</ButtonPrimary>
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import AddNewExercise from "@/components/home/AddNewExercise.vue";
import Header from "@/components/home/Header.vue";
import IconCalendar from "@/components/icons/IconCalendar.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
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
