<template>
  <ButtonPrimary
    type="button"
    class="ml-2 font-medium"
    @click="showModal = true"
  >
    Historial
  </ButtonPrimary>

  <ModalContainer
    className="max-w-3xl !w-5/6"
    v-show="showModal"
    @close="closeModal"
  >
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-semibold text-lg">Historial</h2>
      <template v-if="showSelectDayData">
        <button
          class="font-medium text-start flex items-center justify-start gap-x-1 w-full transition duration-200 hover:text-custom-gray-4"
          @click="showSelectDayData = false"
        >
          <IconChevron class="size-4 mt-0.5" />
          {{ formattedDay(localSelectedDay) }}
        </button>
        <div class="flex flex-col gap-y-3">
          <div
            class="flex flex-col gap-y-2"
            v-for="routine in progress[localSelectedDay]"
          >
            <button
              class="justify-between flex items-center px-4 mb-1 transition duration-200 hover:text-custom-gray-4"
              @click="toggleRoutine(routine.date)"
            >
              <span class="text-end text-sm font-medium">
                {{ routine.date }}
              </span>
              <IconChevron
                class="size-4 mt-px rotate-180 transition-transform duration-200"
                :class="[isExpanded(routine.date) && 'rotate-[270deg]']"
              />
            </button>
            <button
              class="flex flex-col gap-y-1 bg-custom-gray-1 py-3 px-4 rounded-lg transition duration-200 border border-custom-gray-1 hover:border-custom-gray-4"
              v-for="exercise in routine.exercises"
              :key="exercise.id"
              @click="goToExercise(routine.date, exercise.id)"
              v-show="isExpanded(routine.date)"
            >
              <span class="font-medium">{{ exercise.name }}</span>
              <div class="w-full h-px bg-custom-gray-4" />
              <div
                class="flex gap-x-1 text-sm px-4"
                v-for="(serie, serieIdx) in exercise.series"
                :key="serie.id"
                v-show="serie.weight > 0 && serie.reps > 0"
              >
                <span class="font-medium">Serie {{ serieIdx + 1 }}:</span>&#32;
                <span>
                  {{ serie.weight }} {{ serie.weightUnit }} x {{ serie.reps }}
                </span>
              </div>
              <span
                class="text-sm text-pretty text-center"
                v-show="
                  exercise.series.every(
                    (serie) => serie.weight <= 0 && serie.reps <= 0
                  )
                "
              >
                No has cargado series para este ejercicio.
              </span>
            </button>
          </div>
          <span
            class="text-center text-sm text-pretty"
            v-show="!progress[localSelectedDay].length"
          >
            Pasó el dia y no hiciste ninguna rutina 🤦‍♂️
          </span>
        </div>
      </template>
      <div class="flex flex-col gap-y-2" v-else>
        <ButtonSecondary
          class="w-full text-start"
          v-for="(_, day) in 7"
          :key="day"
          @click="selectDay(day)"
        >
          {{ formattedDay(day) }}
        </ButtonSecondary>
      </div>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ButtonPrimary from "../ui/buttons/ButtonPrimary.vue";
import ModalContainer from "../ui/generals/ModalContainer.vue";
import ButtonSecondary from "../ui/buttons/ButtonSecondary.vue";
import type { TDay } from "@/interfaces/progress";
import formattedDay from "@/utils/FormattedDay";
import { useProgressStore } from "@/stores/progress";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import IconChevron from "../icons/IconChevron.vue";

const showModal = ref(false);
const showSelectDayData = ref(false);
const localSelectedDay = ref<TDay>(0);
const router = useRouter();

const progressStore = useProgressStore();
const { progress, selectedDate, selectedDay } = storeToRefs(progressStore);
const expandedRoutines = ref<{ [key: string]: boolean }>({});

const selectDay = (day: number) => {
  localSelectedDay.value = day as TDay;
  showSelectDayData.value = true;
};

const closeModal = () => {
  showSelectDayData.value = false;
  showModal.value = false;
};

const goToExercise = (date: string, exerciseId: string) => {
  showModal.value = false;
  selectedDate.value = date;
  selectedDay.value = localSelectedDay.value;
  router.push(`/ejercicio/${exerciseId}`);
};

const toggleRoutine = (routineDate: string) => {
  expandedRoutines.value[routineDate] = !expandedRoutines.value[routineDate];
};

// Función para verificar si un ejercicio está expandido
const isExpanded = (routineDate: string): boolean => {
  return !!expandedRoutines.value[routineDate];
};
</script>
