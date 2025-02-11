<template>
  <MainContainer title="Editar rutina" showBackButton>
    <SectionContainer>
      <label class="flex flex-col gap-y-1">
        <span class="text-sm font-medium">Nombre</span>
        <input
          placeholder="Nombre de la rutina"
          v-model="routine.name"
          required
          class="w-full"
        />
      </label>
      <label class="flex flex-col gap-y-1">
        <span class="text-sm font-medium">Dificultad</span>
        <select v-model="routine.difficulty">
          <option :value="Difficulty.beginner">Principiante</option>
          <option :value="Difficulty.intermediate">Intermedio</option>
          <option :value="Difficulty.advanced">Avanzado</option>
        </select>
      </label>
      <label class="flex flex-col gap-y-1">
        <span class="text-sm font-medium">Descripción</span>
        <textarea v-model="routine.description"></textarea>
      </label>
    </SectionContainer>
    <SectionContainer>
      <header class="flex items-center justify-between gap-x-3 w-full">
        <h2 class="text-lg font-semibold">Ejercicios</h2>
        <small class="text-white/75">
          {{ routine.exercises.length }} ejercicio{{
            routine.exercises.length != 1 ? "s" : ""
          }}
        </small>
      </header>
      <aside
        class="flex items-center gap-x-3"
        v-for="(exercise, idx) in routine.exercises"
        :key="exercise.id"
      >
        <ButtonSecondary class="w-full text-start">
          <span>{{ exercise.name }}</span>
        </ButtonSecondary>
        <button @click="deleteExercise(idx)">
          <IconTrash
            class="size-5 min-w-4 transition hover:text-custom-error/75"
          />
        </button>
      </aside>
      <CardEmpty v-show="!routine.exercises.length">
        <template #icon>
          <IconBarbell class="size-8 min-w-8 text-white/75" />
        </template>
        <template #description>
          Parece que no has asignado ningún ejercicio aún.
        </template>
        <template #cta> ¿Te gustaría asignar uno? </template>
      </CardEmpty>
      <AssignExercise @exercise="(newExercise) => addExercise(newExercise)" />
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";

import { useMyAccountStore } from "@/stores/myAccount";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useUIStore } from "@/stores/ui";
import { Difficulty, type IMyRoutine } from "@/interfaces/routine";
import { onMounted, ref } from "vue";
import { initialMyRoutine } from "@/constants/initialValues";
import CardEmpty from "@/components/ui/generals/CardEmpty.vue";
import IconBarbell from "@/components/icons/IconBarbell.vue";
import AssignExercise from "@/components/routine/AssignExercise.vue";
import type { IExercise } from "@/interfaces/exercise";
import IconTrash from "@/components/icons/IconTrash.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

const router = useRouter();
const route = useRoute();
const uiStore = useUIStore();
const myAccountStore = useMyAccountStore();

const { myRoutines } = storeToRefs(myAccountStore);

const routine = ref<IMyRoutine>(structuredClone(initialMyRoutine));

const deleteExercise = (idx: number) => {
  routine.value.exercises.splice(idx, 1);
};

const addExercise = (newExercise: IExercise) => {
  if (
    routine.value.exercises.find((exercise) => exercise.id === newExercise.id)
  ) {
    uiStore.showAlert("warning", "Ya asignó este ejercicio a esta rutina");
    return;
  }

  routine.value.exercises.push(JSON.parse(JSON.stringify(newExercise)));
};

onMounted(() => {
  const { routineId } = route.params;
  const _routine = myRoutines.value.find((routine) => routine.id === routineId);

  if (!_routine) {
    uiStore.showAlert("warning", "La rutina no existe");
    router.push("/mi-cuenta/rutinas");
    return;
  }

  routine.value = _routine;
});
</script>
