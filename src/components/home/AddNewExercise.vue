<template>
  <ButtonPrimary
    @click="showModal = true"
    type="button"
    class="mx-auto font-medium"
  >
    Agregar {{ !routine?.exercises?.length ? "" : "nuevo" }} ejercicio
  </ButtonPrimary>

  <ModalContainer
    className="!overflow-visible"
    v-show="showModal"
    @close="showModal = false"
  >
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-medium text-lg">Agregar nuevo ejercicio</h2>
      <p class="text-sm text-center text-pretty">
        Escribe el nombre del ejercicio y luego pulsa el botón de agregar.
      </p>
      <form @submit.prevent="createExercises" class="flex flex-col gap-4">
        <div class="w-full relative">
          <input
            type="search"
            placeholder="Nombre del ejercicio"
            v-model="newExerciseName"
            required
            @focus="showAutocomplete = true"
            @blur="showAutocomplete = false"
            class="w-full"
          />

          <div
            v-show="showAutocomplete && filteredExercises.length > 0"
            class="absolute left-0 z-10 top-full mt-2 w-full flex flex-col gap-y-2 overflow-y-auto max-h-52 items-center gap-x-2 bg-custom-gray-1 rounded-lg px-4 py-2"
          >
            <button
              @mousedown.prevent="setNewExerciseName(exercise.name)"
              @touchstart.prevent="setNewExerciseName(exercise.name)"
              v-for="exercise in filteredExercises"
              class="w-full text-start"
            >
              {{ exercise.name }}
            </button>
          </div>
        </div>
        <ButtonPrimary type="submit" class="mx-auto font-medium">
          Agregar
        </ButtonPrimary>
      </form>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ModalContainer from "@/components/ui/generals/ModalContainer.vue";
import type { IExercise } from "@/interfaces/exercise";
import type { IRoutine } from "@/interfaces/progress";
import { useProgressStore } from "@/stores/progress";
import { parseDate } from "@/utils/FormattedDate";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const progressStore = useProgressStore();

const { routine, selectedDay, progress, selectedDate, myExercises } =
  storeToRefs(progressStore);

const newExerciseName = ref("");
const showModal = ref(false);

const showAutocomplete = ref(false);
const filteredExercises = computed(() => {
  if (!newExerciseName.value.trim()) return myExercises.value;

  return myExercises.value.filter((exercise) =>
    exercise.name.toLowerCase().includes(newExerciseName.value.toLowerCase())
  );
});

onMounted(() => {
  progressStore.findRoutine();
});

const setNewExerciseName = (name: string) => {
  newExerciseName.value = name;
  showAutocomplete.value = false;
};

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
    progress.value[selectedDay.value].unshift(newRoutine);
    routine.value = newRoutine;

    newExerciseName.value = "";
    showModal.value = false;
    return;
  }

  // Validar si el ejercicio no exista en la lista de ejercicios
  const existExercise = myExercises.value.find(
    (exercise) => exercise.id === newExercise.id
  );

  if (!existExercise) {
    myExercises.value.push(newExercise);
  }

  routine.value?.exercises.push(newExercise);
  newExerciseName.value = "";
  showModal.value = false;
};
</script>
