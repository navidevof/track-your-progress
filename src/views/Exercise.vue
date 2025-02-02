<template>
  <MainContainer>
    <ButtonBack />
    <h1
      class="font-bold text-center text-xl md:text-2xl text-pretty mx-auto w-5/6"
    >
      Ejercicio
      <form
        @submit.prevent="showEdit = false"
        v-if="exercise?.name.trim() !== undefined"
        class="w-full"
      >
        <input
          type="text"
          class="text-base inline w-5/6 mt-1"
          v-model="exercise.name"
          v-show="showEdit"
          autofocus
          required
        />
        <strong
          v-show="!showEdit"
          class="font-black text-pretty break-words w-5/6"
          @dblclick="showEdit = true"
        >
          {{ exercise?.name }}
        </strong>
        <button
          type="button"
          @click="showEdit = !showEdit"
          class="mt-1 ml-2 inline"
        >
          <IconEdit class="size-4 min-w-4" />
        </button>
      </form>
    </h1>
    <SectionContainer class="items-end flex">
      <label class="flex items-center gap-x-2">
        Igualar unidad de peso:
        <input type="checkbox" v-model="isWeightUnitChange" />
      </label>
    </SectionContainer>
    <SectionContainer v-show="topSet">
      <h2 class="font-semibold text-lg">Top set:</h2>
      <div class="justify-between flex items-center text-sm font-medium">
        <span>
          {{ topSet?.weight }} {{ topSet?.weightUnit }} x
          {{ topSet?.reps }} Reps
        </span>
        <span>
          {{ topSet?.date }}
        </span>
      </div>
    </SectionContainer>
    <SectionContainer v-if="exercise?.series.length">
      <aside
        class="flex flex-col gap-y-3 bg-custom-black-2 px-4 py-3 rounded-lg border-custom-gray-1 border"
        v-for="(serie, idx) in exercise?.series"
        :key="idx"
      >
        <header class="flex justify-between items-center">
          <span class="font-semibold text-lg">Serie {{ idx + 1 }}</span>
          <button
            @click="removeSerie(idx)"
            class="text-custom-white-1 hover:text-custom-error/80"
          >
            <IconX class="size-4" />
          </button>
        </header>
        <div class="flex gap-x-3 items-center w-full">
          <label class="flex flex-col gap-y-1 w-full">
            <span class="text-sm">Peso</span>
            <input
              v-model="serie.weight"
              placeholder="Peso"
              min="1"
              type="number"
              class="w-full"
            />
          </label>
          <label class="flex flex-col gap-y-1 w-full">
            <span class="text-sm">Unidad</span>
            <select
              class="w-full disabled:cursor-not-allowed"
              v-model="serie.weightUnit"
              :disabled="idx > 0 && isWeightUnitChange"
              @change="changeWeightUnit"
            >
              <option value="kg">Kg</option>
              <option value="lbs">Lbs</option>
              <option value="laminas">Laminas</option>
              <option value="otro">Otro</option>
            </select>
          </label>
          <label class="flex flex-col gap-y-1 w-full">
            <span class="text-sm">Reps</span>
            <input
              v-model="serie.reps"
              placeholder="Reps"
              min="1"
              type="number"
              class="w-full"
            />
          </label>
        </div>
      </aside>
    </SectionContainer>
    <SectionContainer>
      <p
        class="text-center text-sm text-pretty"
        v-show="!exercise?.series.length"
      >
        Aún no realizas ninguna serie. ¿Te gustaría registrar tu progreso?
      </p>
      <ButtonPrimary @click="addSerie" class="mx-auto font-medium">
        Agregar serie
      </ButtonPrimary>
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import IconEdit from "@/components/icons/IconEdit.vue";
import IconX from "@/components/icons/IconX.vue";
import ButtonBack from "@/components/ui/buttons/ButtonBack.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import { initialSeries } from "@/constants/initialValues";
import type { IExercise } from "@/interfaces/exercise";
import { useProgressStore } from "@/stores/progress";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const progressStore = useProgressStore();
const { routine } = storeToRefs(progressStore);
const exercise = ref<IExercise>();

const showEdit = ref<boolean>(false);
const isWeightUnitChange = ref<boolean>(true);

onMounted(() => {
  progressStore.findRoutine();

  const exerciseId = route.params.exerciseId as string;
  if (!routine.value || !exerciseId) return;

  const currentExercise = routine.value.exercises.find(
    (exercise) => exercise.id === exerciseId
  );

  if (!currentExercise) return;

  exercise.value = currentExercise;

  if (exercise.value.series.length === 0) {
    exercise.value.series = structuredClone(initialSeries);
  }
});

const topSet = computed(() => {
  const exerciseId = route.params.exerciseId as string;
  if (!exerciseId) return null;

  const routine = progressStore.findLastExerciseRecord(exerciseId);

  const topSet = routine?.exercise.series
    .sort((a, b) => b.weight - a.weight)
    .sort((a, b) => {
      return b.reps - a.reps;
    })[0];

  if (!topSet || topSet?.reps === 0) return null;

  return {
    date: routine?.date,
    ...topSet,
  };
});

const addSerie = () => {
  if (!exercise.value) return;

  exercise.value.series.push(structuredClone(initialSeries[0]));
};

const removeSerie = (index: number) => {
  if (!exercise.value) return;

  exercise.value.series.splice(index, 1);
};

const changeWeightUnit = () => {
  if (!exercise.value || !isWeightUnitChange.value) return;

  const firstSerie = exercise.value.series[0];
  exercise.value.series = exercise.value.series.map((serie) => ({
    ...serie,
    weightUnit: firstSerie.weightUnit,
  }));
};

watch(isWeightUnitChange, changeWeightUnit);
</script>
