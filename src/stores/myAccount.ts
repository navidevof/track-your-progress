import type { IMyExercise } from "@/interfaces/exercise";
import type { IMyRoutine } from "@/interfaces/routine";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMyAccountStore = defineStore(
  "myAccount",
  () => {
    const myExercises = ref<IMyExercise[]>([]);
    const myRoutines = ref<IMyRoutine[]>([]);

    return {
      myExercises,
      myRoutines,
    };
  },
  { persist: true }
);
