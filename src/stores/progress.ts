import { initialProgress } from "@/constants/initialValues";
import type { IProgress, IRoutine, TDay } from "@/interfaces/progress";
import { getLocalISODate } from "@/utils/GetLocalDate";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useProgressStore = defineStore(
  "progress",
  () => {
    const selectedDate = ref(getLocalISODate(new Date()));
    const selectedDay = ref<TDay>(
      new Date(selectedDate.value).getDay() as TDay
    );
    const progress = ref<IProgress>(structuredClone(initialProgress));
    const lastRoutine = ref<IRoutine>();
    const routine = ref<IRoutine>();

    // Encuentra la última rutina válida (la más reciente) para el día seleccionado.
    const findLastRoutine = () => {
      const routinesForDay = progress.value[selectedDay.value];

      if (!routinesForDay?.length) {
        lastRoutine.value = undefined;
        return;
      }

      const todayDate = new Date().toLocaleDateString();
      const sortedRoutines = routinesForDay.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Si la rutina más reciente es de hoy, asignar la segunda más reciente (si existe).
      if (sortedRoutines.length > 1 && sortedRoutines[0].date === todayDate) {
        lastRoutine.value = sortedRoutines[1];
        return;
      }

      // Asignar la rutina más reciente.
      lastRoutine.value = sortedRoutines[0];
    };

    // Encuentra o crea la rutina para el día seleccionado.
    const findRoutine = () => {
      findLastRoutine();

      if (!lastRoutine.value) {
        routine.value = undefined;
        return;
      }

      const todayDate = new Date().toLocaleDateString();
      const routinesForDay = progress.value[selectedDay.value];

      // Si ya existe una rutina para hoy, usarla.
      const routineFromToday = routinesForDay.find((r) => r.date === todayDate);
      if (routineFromToday) {
        routine.value = routineFromToday;
        return;
      }

      // Crear una nueva rutina basada en la última rutina.
      const newRoutine: IRoutine = {
        date: todayDate,
        exercises: structuredClone(
          lastRoutine.value.exercises.map((exercise) => ({
            ...exercise,
            series: exercise.series.map(() => ({
              id: Date.now() + Math.random(),
              reps: 0,
              weight: 0,
              weightUnit: "kg",
            })),
          }))
        ),
      };

      // Agregar la nueva rutina al progreso del día seleccionado.
      routinesForDay.push(newRoutine);
      routine.value = newRoutine;
    };

    // Encuentra el último registro de un ejercicio específico (excluyendo el día actual).
    const findLastExerciseRecord = (exerciseId: string) => {
      // 1. Obtener todas las rutinas de todos los días
      const allRoutines = Object.values(progress.value).flat();

      if (allRoutines.length === 0) {
        return null;
      }

      // 2. Fecha actual para comparación
      const todayDateString = new Date().toDateString();

      // 3. Filtrar y ordenar registros
      const exerciseRecords = allRoutines
        .filter((routine) => {
          const routineDate = new Date(routine.date);

          return (
            routineDate.toDateString() !== todayDateString &&
            selectedDate.value !== getLocalISODate(routineDate)
          ); // Excluir hoy
        })
        .flatMap((routine) =>
          routine.exercises
            .filter((exercise) => exercise.id === exerciseId)
            .map((exercise) => ({
              date: routine.date,
              exercise,
            }))
        )
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ); // Orden descendente

      return exerciseRecords[0] || null;
    };

    // Computed para verificar si la última rutina cargada es la misma que la actual.
    const isLastRoutineSame = computed(() => {
      return routine.value?.date === lastRoutine.value?.date;
    });

    return {
      selectedDay,
      selectedDate,
      progress,
      routine,
      lastRoutine,
      isLastRoutineSame,
      findRoutine,
      findLastExerciseRecord,
    };
  },
  {
    persist: true,
  }
);
