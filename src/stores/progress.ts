import { computed, ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import LZString from "lz-string";
import {
  initialAssignedRoutines,
  initialProgress,
} from "@/constants/initialValues";
import type { IProgress, TDay } from "@/interfaces/progress";
import type { IAssignedRoutines, IRoutine } from "@/interfaces/routine";
import { parseDate } from "@/utils/FormattedDate";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { useMyAccountStore } from "./myAccount";

export const useProgressStore = defineStore(
  "progress",
  () => {
    const myAccountStore = useMyAccountStore();
    const { myRoutines } = storeToRefs(myAccountStore);

    const selectedDate = ref(getLocalISODate(new Date()));
    const selectedDay = ref<TDay>(new Date().getDay() as TDay);
    const progress = ref<IProgress>(structuredClone(initialProgress));
    const assignedRoutines = ref<IAssignedRoutines>(
      structuredClone(initialAssignedRoutines)
    );
    const routine = ref<IRoutine>();
    const selectedDateIsInvalid = computed(() => {
      const newSelectedDate = new Date(selectedDate.value + "T00:00:00");
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      // Obtener timestamps considerando el offset de la zona horaria
      const todayEpoch =
        todayDate.getTime() - todayDate.getTimezoneOffset() * 60000;
      const selectedEpoch =
        newSelectedDate.getTime() - newSelectedDate.getTimezoneOffset() * 60000;

      return selectedEpoch > todayEpoch;
    });

    // Remove routines performed after current date (for the current day)
    const removeRoutinesAfterToday = () => {
      const dateLastRoutineByDay = progress.value[selectedDay.value];
      if (!dateLastRoutineByDay) return;

      const idx = dateLastRoutineByDay.findIndex(
        (routine) => routine.date === selectedDate.value
      );

      if (idx !== -1) {
        dateLastRoutineByDay.splice(idx + 1);
      }
    };

    // Función principal para encontrar o crear la rutina
    const findRoutine = () => {
      const targetDate = parseDate(selectedDate.value);
      const targetISO = getLocalISODate(targetDate);
      const dayOfWeek = targetDate.getDay() as TDay;
      const routinesForDay = progress.value[dayOfWeek] || [];

      let targetRoutine = routinesForDay.find((r) => r.date === targetISO);

      if (targetRoutine) {
        const myRoutine = myRoutines.value.find(
          (routine) => routine.id === targetRoutine!.id
        );

        if (myRoutine) {
          targetRoutine.exercises = targetRoutine.exercises.filter(
            (exercise) => {
              if (myRoutine.exercises.find((e) => exercise.id === e.id)) {
                return exercise;
              }
            }
          );
        }

        routine.value = targetRoutine;
        return;
      }

      const routineId =
        assignedRoutines.value && assignedRoutines.value[dayOfWeek];

      const routineData = myRoutines.value.find(
        (routine) => routine.id === routineId
      );

      const assignedRoutine =
        Boolean(routineData) && JSON.parse(JSON.stringify(routineData));

      if (assignedRoutine) {
        targetRoutine = JSON.parse(
          JSON.stringify({
            date: targetISO,
            id: assignedRoutine.id,
            exercises: assignedRoutine.exercises,
          })
        ) as IRoutine;

        routinesForDay.unshift(targetRoutine);
        progress.value[dayOfWeek] = routinesForDay;
      }

      routine.value = targetRoutine;
    };

    const findLastExerciseRecord = (exerciseId: string) => {
      const allRoutines = Object.values(progress.value).flat();

      return (
        allRoutines
          .filter((routine) => routine.date !== selectedDate.value)
          .flatMap((routine) =>
            routine.exercises
              .filter(
                (exercise) =>
                  exercise.id === exerciseId &&
                  exercise.series.some(
                    (series) => series.reps > 0 && series.weight > 0
                  )
              )
              .map((exercise) => ({ date: routine.date, exercise }))
          )
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0] || null
      );
    };

    // Reacción a cambios en la fecha seleccionada
    watch(selectedDate, () => {
      const targetDate = parseDate(selectedDate.value);
      selectedDay.value = targetDate.getDay() as TDay;

      removeRoutinesAfterToday();
      findRoutine();
    });

    return {
      selectedDate,
      selectedDay,
      assignedRoutines,
      progress,
      routine,
      selectedDateIsInvalid,
      findRoutine,
      findLastExerciseRecord,
    };
  },
  {
    persist: {
      key: "progress",
      storage: localStorage,
      serializer: {
        serialize: (state) => LZString.compress(JSON.stringify(state)),
        deserialize: (value) => JSON.parse(LZString.decompress(value) || "{}"),
      },
    },
  }
);
