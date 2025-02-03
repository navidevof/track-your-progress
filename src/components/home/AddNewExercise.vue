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
            ref="inputField"
            class="w-full"
          />
          <div
            v-show="showAutocomplete && filteredExercises.length > 0"
            class="absolute left-0 z-10 top-full mt-2 w-full flex flex-col divide-y divide-custom-gray-2 overflow-y-auto max-h-52 items-center gap-x-2 bg-custom-gray-1 rounded-lg px-4 py-2"
            ref="autocompleteContainer"
          >
            <button
              @mousedown.prevent="selectExercise(exercise.name)"
              v-for="exercise in filteredExercises"
              class="w-full text-start py-2"
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
import { ref, onMounted, onUnmounted, computed } from "vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ModalContainer from "@/components/ui/generals/ModalContainer.vue";
import type { IExercise } from "@/interfaces/exercise";
import type { IRoutine } from "@/interfaces/progress";
import { useProgressStore } from "@/stores/progress";
import { parseDate } from "@/utils/FormattedDate";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { storeToRefs } from "pinia";

const progressStore = useProgressStore();
const { routine, selectedDay, progress, selectedDate, myExercises } =
  storeToRefs(progressStore);

const newExerciseName = ref("");
const showModal = ref(false);
const showAutocomplete = ref(false);
const inputField = ref<HTMLInputElement | null>(null);
const autocompleteContainer = ref<HTMLDivElement | null>(null);

// Filtrar ejercicios según el texto ingresado
const filteredExercises = computed(() => {
  if (!newExerciseName.value.trim()) return myExercises.value;
  return myExercises.value.filter((exercise) =>
    exercise.id.toLowerCase().includes(formattedUrlSlug(newExerciseName.value))
  );
});

onMounted(() => {
  progressStore.findRoutine();
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("touchstart", handleClickOutside);
});

// Cerrar el autocompletado si se hace clic o toque fuera del contenedor
const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  const target = event.target as Node;

  if (
    autocompleteContainer.value &&
    !autocompleteContainer.value.contains(target) &&
    inputField.value &&
    !inputField.value.contains(target)
  ) {
    showAutocomplete.value = false;
  }
};

// Seleccionar un ejercicio del autocompletado
const selectExercise = (name: string) => {
  newExerciseName.value = name;
  showAutocomplete.value = false; // Cerrar el autocompletado al seleccionar
};

// Crear un nuevo ejercicio
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

  // Validar si el ejercicio no existe en la lista de ejercicios
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
