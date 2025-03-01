<template>
  <header class="w-full flex flex-col gap-y-3">
    <div class="w-full flex justify-end items-center">
      <input
        type="date"
        class="ml-1 text-white font-medium"
        v-model="selectedDate"
        @input="progressStore.findRoutine"
        :max="maxDate"
      />
    </div>
    <div class="flex items-center w-full justify-between gap-x-3">
      <div class="flex-1 line-clamp-1 w-full overflow-hidden">
        <h2 class="font-medium">
          Rutina:
          <span class="text-white/75 font-normal">
            {{
              myRoutines.find((r) => r.id === routine?.id)?.name ||
              "Sin rutina asignada"
            }}
          </span>
        </h2>
      </div>
      <AssignRoutine
        v-if="!isRoutineExecuted && assignedRoutines[selectedDay]"
        buttonClass="!text-xs"
      >
        <template #button-text> Cambiar </template>
      </AssignRoutine>
      <ButtonSecondary
        v-show="assignedRoutines[selectedDay]"
        @click="unassignRoutine"
        class="!border-custom-error !text-custom-error"
      >
        <IconTrash class="size-4" />
      </ButtonSecondary>
    </div>
    <SelectDay />
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useProgressStore } from "@/stores/progress";
import { useMyAccountStore } from "@/stores/myAccount";
import SelectDay from "./SelectDay.vue";
import AssignRoutine from "../routine/AssignRoutine.vue";
import { computed } from "vue";
import ButtonSecondary from "../ui/buttons/ButtonSecondary.vue";
import IconTrash from "../icons/IconTrash.vue";

const progressStore = useProgressStore();
const myAccountStore = useMyAccountStore();
const { selectedDate, routine, assignedRoutines, selectedDay } =
  storeToRefs(progressStore);
const { myRoutines } = storeToRefs(myAccountStore);

const isRoutineExecuted = computed(() => {
  if (!routine.value) return false;

  return routine.value.exercises
    .flatMap((e) => e.series)
    .some((s) => s.reps != 0 || s.weight != 0);
});

const unassignRoutine = () => {
  assignedRoutines.value[selectedDay.value] = "";
  if (!routine.value) return;

  routine.value.id = "";
};

const maxDate = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().split("T")[0];
});
</script>
