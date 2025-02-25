<template>
  <MainContainer title="Registra tu progreso">
    <Header />
    <SectionContainer v-if="routine?.id">
      <div
        class="flex items-center gap-x-3 relative"
        v-for="(exercise, idx) in routine?.exercises"
        v-show="routine?.exercises?.length"
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
      <CardEmpty v-if="!routine?.exercises.length">
        <template #icon>
          <IconBarbell class="size-8 min-w-8 text-white/75" />
        </template>
        <template #description>
          Parece que esta rutina no tiene ejercicios.
        </template>
        <template #cta> ¿Te gustaría agregar uno? </template>
      </CardEmpty>
      <AssignExercise @exercise="(newExercise) => addExercise(newExercise)" />
    </SectionContainer>
    <SectionContainer v-else>
      <CardEmpty>
        <template #icon>
          <IconCalendar class="size-8 min-w-8 text-white/75" />
        </template>
        <template #description>
          Parece que no has realizado ninguna rutina este día.
        </template>
        <template #cta> ¿Te gustaría asignar una? </template>
      </CardEmpty>
      <AssignRoutine />
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import Header from "@/components/home/Header.vue";
import IconBarbell from "@/components/icons/IconBarbell.vue";
import IconCalendar from "@/components/icons/IconCalendar.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import AssignExercise from "@/components/routine/AssignExercise.vue";
import AssignRoutine from "@/components/routine/AssignRoutine.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import CardEmpty from "@/components/ui/generals/CardEmpty.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import type { IExercise } from "@/interfaces/exercise";
import { useMyAccountStore } from "@/stores/myAccount";
import { useProgressStore } from "@/stores/progress";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const uiStore = useUIStore();
const progressStore = useProgressStore();
const myAccountStore = useMyAccountStore();

const { routine } = storeToRefs(progressStore);
const { myRoutines } = storeToRefs(myAccountStore);

onMounted(() => {
  progressStore.findRoutine();
});

const addExercise = (newExercise: IExercise) => {
  if (!routine.value || !myRoutines.value) return;
  if (
    routine.value.exercises.find((exercise) => exercise.id === newExercise.id)
  ) {
    uiStore.showAlert("warning", "Ya asignó este ejercicio a esta rutina");
    return;
  }

  routine.value.exercises.push(newExercise);
  myRoutines.value
    .find((r) => r.id === routine.value?.id)
    ?.exercises.push(newExercise);
};

const deleteExercise = (idx: number) => {
  routine.value?.exercises.splice(idx, 1);
};
</script>
