<template>
  <MainContainer showBackButton>
    <h1
      class="font-bold text-center text-xl md:text-2xl text-pretty mx-auto w-5/6"
    >
      Ejercicio
      <strong class="font-black text-pretty break-words w-5/6 block mx-auto">
        {{ exercise?.name }}
      </strong>
    </h1>
    <SectionContainer class="items-end flex flex-col">
      <div class="relative" ref="dropdownRef">
        <div
          class="absolute -translate-y-1/3 right-0 translate-x-1/3 rounded-full size-4 text-[10px] font-medium p-1 bg-custom-error flex items-center justify-center"
          v-show="countAdjustWeightActive > 0"
        >
          {{ countAdjustWeightActive }}
        </div>
        <ButtonSecondary @click="showAdjustWeight = !showAdjustWeight">
          Ajustes de peso
        </ButtonSecondary>
        <div
          class="absolute top-full mt-2 right-0 bg-custom-gray-1 rounded-lg py-2 px-4 min-w-full"
          v-show="showAdjustWeight"
        >
          <label class="flex items-center justify-end gap-x-2 text-nowrap">
            Igualar peso:
            <input type="checkbox" v-model="isWeightChange" />
          </label>
          <label class="flex items-center justify-end gap-x-2 text-nowrap">
            Igualar unidad:
            <input type="checkbox" v-model="isWeightUnitChange" />
          </label>
        </div>
      </div>
    </SectionContainer>
    <TopSet />
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
              :disabled="idx > 0 && isWeightChange"
              @input="changeWeight"
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
import TopSet from "@/components/exercise/TopSet.vue";
import IconX from "@/components/icons/IconX.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import { initialSeries } from "@/constants/initialValues";
import type { IExercise } from "@/interfaces/exercise";
import { useProgressStore } from "@/stores/progress";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const progressStore = useProgressStore();
const { routine } = storeToRefs(progressStore);
const exercise = ref<IExercise>();

const isWeightChange = ref<boolean>(true);
const isWeightUnitChange = ref<boolean>(true);
const showAdjustWeight = ref<boolean>(false);

const dropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showAdjustWeight.value = false;
  }
};

const addSerie = () => {
  if (!exercise.value) return;

  const newSerie = structuredClone(initialSeries[0]);

  if (isWeightChange.value)
    newSerie.weight =
      exercise.value.series[0]?.weight || initialSeries[0].weight;
  if (isWeightUnitChange.value)
    newSerie.weightUnit =
      exercise.value.series[0]?.weightUnit || initialSeries[0].weightUnit;
  exercise.value.series.push(newSerie);
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

const changeWeight = () => {
  if (!exercise.value || !isWeightChange.value) return;

  const firstSerie = exercise.value.series[0];
  exercise.value.series = exercise.value.series.map((serie) => ({
    ...serie,
    weight: firstSerie.weight,
  }));
};

const countAdjustWeightActive = computed(() => {
  if (!exercise.value) return 0;

  return Number(isWeightChange.value) + Number(isWeightUnitChange.value);
});

watch(isWeightUnitChange, changeWeightUnit);
watch(isWeightChange, changeWeight);

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

  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
