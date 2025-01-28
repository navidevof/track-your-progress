<template>
  <MainContainer>
    <h1 class="text-xl font-bold text-center md:text-2xl">
      Registra tu progreso
    </h1>
    <aside class="w-full flex justify-between items-center">
      <span class="font-medium">
        Dia:
        <input
          type="date"
          class="ml-1 text-white"
          v-model="selectedDate"
          @input="progressStore.findRoutine"
        />
      </span>
      <ButtonPrimary type="button" class="ml-2 font-medium">
        Historial
      </ButtonPrimary>
    </aside>
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
      <ButtonPrimary
        @click="showModal = true"
        type="button"
        class="mx-auto font-medium"
      >
        Agregar {{ !routine?.exercises?.length ? "" : "nuevo" }} ejercicio
      </ButtonPrimary>
    </SectionContainer>
  </MainContainer>

  <ModalContainer v-show="showModal" @close="showModal = false">
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-medium text-lg">Agregar nuevo ejercicio</h2>
      <p class="text-sm text-center text-pretty">
        Escribe el nombre del ejercicio y luego pulsa el botón de agregar.
      </p>
      <form @submit.prevent="createExercises" class="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre del ejercicio"
          v-model="newExerciseName"
          required
          autofocus
        />
        <ButtonPrimary type="submit" class="mx-auto font-medium">
          Agregar
        </ButtonPrimary>
      </form>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import IconTrash from "@/components/icons/IconTrash.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import ModalContainer from "@/components/ui/generals/ModalContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import type { IExercise } from "@/interfaces/exercise";
import type { IRoutine } from "@/interfaces/progress";
import { useProgressStore } from "@/stores/progress";
import { parseDate } from "@/utils/FormattedDate";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const progressStore = useProgressStore();

const { routine, selectedDay, progress, selectedDate } =
  storeToRefs(progressStore);

const newExerciseName = ref("");
const showModal = ref(false);

onMounted(() => {
  progressStore.findRoutine();
});

const createExercises = () => {
  if (!newExerciseName.value.trim()) return;

  const newExercise: IExercise = {
    id: formattedUrlSlug(newExerciseName.value),
    name: newExerciseName.value,
    series: [],
    createdAt: Date.now(),
  };

  if (!routine.value && selectedDate.value) {
    const parserSelectedDate = parseDate(selectedDate.value);
    const newRoutine: IRoutine = {
      date: getLocalISODate(parserSelectedDate),
      exercises: [newExercise],
    };
    progress.value[selectedDay.value].push(newRoutine);
    routine.value = newRoutine;

    newExerciseName.value = "";
    showModal.value = false;
    return;
  }

  routine.value?.exercises.push(newExercise);
  newExerciseName.value = "";
  showModal.value = false;
};

const deleteExercise = (idx: number) => {
  routine.value?.exercises.splice(idx, 1);
};
</script>
