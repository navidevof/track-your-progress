import { initialProgress } from "@/constants/initialValues";
import type { IMyExercise } from "@/interfaces/exercise";
import type { IProgress, IRoutine, TDay } from "@/interfaces/progress";
import { parseDate } from "@/utils/FormattedDate";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useProgressStore = defineStore(
  "progress",
  () => {
    const selectedDate = ref(getLocalISODate(new Date()));
    const selectedDay = ref<TDay>(new Date().getDay() as TDay);
    const progress = ref<IProgress>(structuredClone(initialProgress));
    const routine = ref<IRoutine>();
    const lastRoutine = ref<IRoutine>();
    const myExercises = ref<IMyExercise[]>([]);

    const findLastRoutineForDay = (
      day: TDay,
      date: Date,
      excludeCurrent: boolean = false
    ): IRoutine | undefined => {
      const routines = (progress.value[day] || []).filter((r) =>
        excludeCurrent ? new Date(r.date) < date : new Date(r.date) <= date
      );

      return routines.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
    };

    const createNewRoutineFromLast = (
      lastRoutine: IRoutine,
      date: string
    ): IRoutine => ({
      date,
      exercises: structuredClone(
        lastRoutine.exercises.map((exercise) => ({
          ...exercise,
          series: exercise.series.map((series) => ({
            id: Date.now() + Math.random(), // Generar un ID único
            reps: 0,
            weight: 0,
            weightUnit: series.weightUnit,
          })),
        }))
      ),
    });

    // Función principal para encontrar o crear la rutina
    const findRoutine = () => {
      const targetDate = parseDate(selectedDate.value);
      const targetISO = getLocalISODate(targetDate);
      const todayISO = getLocalISODate(new Date());
      const dayOfWeek = targetDate.getDay() as TDay;
      const routinesForDay = progress.value[dayOfWeek] || [];

      let targetRoutine = routinesForDay.find((r) => r.date === targetISO);

      if (!targetRoutine) {
        if (targetISO === todayISO) {
          const lastRoutineForToday = findLastRoutineForDay(
            dayOfWeek,
            new Date(todayISO),
            true
          );

          if (lastRoutineForToday) {
            targetRoutine = createNewRoutineFromLast(
              lastRoutineForToday,
              todayISO
            );
            routinesForDay.unshift(targetRoutine);
            progress.value[dayOfWeek] = routinesForDay;
          }
        } else {
          targetRoutine = findLastRoutineForDay(dayOfWeek, targetDate);
          if (targetRoutine) {
            targetRoutine = createNewRoutineFromLast(targetRoutine, targetISO);
            routinesForDay.unshift(targetRoutine);
          }

          progress.value[dayOfWeek] = routinesForDay;
        }
      }

      routine.value = targetRoutine;
      lastRoutine.value = findLastRoutineForDay(dayOfWeek, targetDate, true);
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

    // Computed
    const isLastRoutineSame = computed(
      () => routine.value?.date === lastRoutine.value?.date
    );

    // Reacción a cambios en la fecha seleccionada
    watch(selectedDate, () => {
      const targetDate = parseDate(selectedDate.value);
      selectedDay.value = targetDate.getDay() as TDay;
      findRoutine();
    });

    return {
      selectedDate,
      selectedDay,
      progress,
      routine,
      lastRoutine,
      isLastRoutineSame,
      myExercises,
      findRoutine,
      findLastExerciseRecord,
    };
  },
  {
    persist: true,
  }
);
