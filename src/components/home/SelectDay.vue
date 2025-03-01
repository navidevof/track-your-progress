<template>
  <div class="flex w-full max-w-sm mx-auto justify-around gap-x-2 items-center">
    <div
      class="flex flex-col gap-y-1 justify-center items-center"
      v-for="(_, day) in 7"
      :key="day"
    >
      <button
        class="rounded-full size-9 min-w-9 border border-white font-medium"
        :class="[
          selectedDay == day
            ? 'bg-white text-custom-black-1'
            : 'bg-custom-gray-1',
          isSelectedDateInvalid(day),
        ]"
        @click="isSelectedDateInvalid(day) == '' && selectDay(day)"
      >
        {{ formattedDay(day)[0] }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TDay } from "@/interfaces/progress";
import { useProgressStore } from "@/stores/progress";
import { parseDate } from "@/utils/FormattedDate";
import formattedDay from "@/utils/FormattedDay";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const progressStore = useProgressStore();
const { selectedDate, selectedDay } = storeToRefs(progressStore);

// `today` se actualizará cada vez que cambie `selectedDate`
const today = ref<Date>(parseDate(selectedDate.value));
const currentDate = ref<Date>(parseDate(selectedDate.value));

const getCurrentDayIndex = () => currentDate.value.getDay();

// Calcular la fecha para un día específico de la semana
const getDateForDay = (targetDayIndex: number) => {
  const currentDayIndex = getCurrentDayIndex();
  let difference = targetDayIndex - currentDayIndex;

  if (difference < 0) {
    difference += 7;
    difference -= 7;
  }

  // Crear una nueva fecha en base a `today.value` (para evitar mutarlo directamente)
  const targetDate = new Date(today.value);
  targetDate.setDate(today.value.getDate() + difference);
  targetDate.setHours(0, 0, 0, 0); // Normalizar la hora

  return getLocalISODate(targetDate);
};

// Actualizar la fecha seleccionada
const selectDay = (dayIndex: number) => {
  const targetDate = getDateForDay(dayIndex);
  selectedDate.value = targetDate;
  selectedDay.value = dayIndex as TDay;
};

const isSelectedDateInvalid = (day: any) => {
  // Convertir ambas fechas a la zona horaria local y normalizar a medianoche
  const newSelectedDate = new Date(selectedDate.value + "T00:00:00");
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  // Obtener timestamps considerando el offset de la zona horaria
  const todayEpoch =
    todayDate.getTime() - todayDate.getTimezoneOffset() * 60000;
  const selectedEpoch =
    newSelectedDate.getTime() - newSelectedDate.getTimezoneOffset() * 60000;

  if (todayDate.getDay() < day || selectedEpoch > todayEpoch)
    return "!opacity-45 !cursor-not-allowed";

  return "";
};

watch(selectedDate, (newDate) => {
  today.value = parseDate(newDate);
  currentDate.value = parseDate(newDate);
});
</script>
