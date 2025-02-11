import { ref } from "vue";
import { defineStore } from "pinia";
import LZString from "lz-string";
import type { IMyExercise } from "@/interfaces/exercise";
import type { IMyRoutine } from "@/interfaces/routine";

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
  {
    persist: {
      key: "myAccount",
      storage: localStorage,
      serializer: {
        serialize: (state) => LZString.compress(JSON.stringify(state)),
        deserialize: (value) => JSON.parse(LZString.decompress(value) || "{}"),
      },
    },
  }
);
