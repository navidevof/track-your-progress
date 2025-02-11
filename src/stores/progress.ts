import { ref, watch } from "vue";
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

    // Función principal para encontrar o crear la rutina
    const findRoutine = () => {
      const targetDate = parseDate(selectedDate.value);
      const targetISO = getLocalISODate(targetDate);
      const dayOfWeek = targetDate.getDay() as TDay;
      const routinesForDay = progress.value[dayOfWeek] || [];

      let targetRoutine = routinesForDay.find((r) => r.date === targetISO);

      if (targetRoutine) {
        routine.value = targetRoutine;

        return;
      }

      const routineId =
        assignedRoutines.value && assignedRoutines.value[dayOfWeek];
      const assignedRoutine = myRoutines.value.find(
        (routine) => routine.id === routineId
      );

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
      findRoutine();
    });

    return {
      selectedDate,
      selectedDay,
      assignedRoutines,
      progress,
      routine,
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
