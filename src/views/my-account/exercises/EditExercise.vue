<template>
  <MainContainer title="Editar ejercicio" showBackButton>
    <SectionContainer>
      <label class="flex flex-col gap-y-1">
        <span class="text-sm font-medium">Nombre</span>
        <input
          placeholder="Nombre del ejercicio"
          v-model="exercise.name"
          required
          class="w-full"
        />
      </label>
      <label class="flex flex-col gap-y-1">
        <span class="text-sm font-medium">Repeticiones (recomendadas)</span>
        <input
          placeholder="Repeticiones (recomendadas)"
          v-model="exercise.possibleReps"
          required
          type="number"
          min="1"
          class="w-full"
        />
      </label>
      <div class="flex items-end gap-x-3 justify-between">
        <label class="flex flex-col gap-y-1 w-full">
          <span class="text-sm font-medium">Tiempo de ejecución</span>
          <input
            placeholder="Tiempo de ejecución"
            v-model="exercise!.possibleExecutionTime!.value"
            required
            min="1"
            class="w-full"
          />
        </label>
        <select v-model="exercise!.possibleExecutionTime!.unit">
          <option :value="TimeUnit.MINUTES">Min</option>
          <option :value="TimeUnit.SECONDS">Seg</option>
        </select>
      </div>
      <div class="flex items-end gap-x-3 justify-between">
        <label class="flex flex-col gap-y-1 w-full">
          <span class="text-sm font-medium">Tiempo de descanso</span>
          <input
            placeholder="Tiempo de ejecución"
            v-model="exercise!.possibleRestTime!.value"
            required
            min="1"
            class="w-full"
          />
        </label>
        <select v-model="exercise!.possibleRestTime!.unit">
          <option :value="TimeUnit.MINUTES">Min</option>
          <option :value="TimeUnit.SECONDS">Seg</option>
        </select>
      </div>
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import { initialMyExercise } from "@/constants/initialValues";
import { TimeUnit, type IMyExercise } from "@/interfaces/exercise";
import { useMyAccountStore } from "@/stores/myAccount";
import { useUIStore } from "@/stores/ui";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const uiStore = useUIStore();
const myAccountStore = useMyAccountStore();

const { myExercises } = storeToRefs(myAccountStore);

const exercise = ref<IMyExercise>(structuredClone(initialMyExercise));

onMounted(() => {
  const { exerciseId } = route.params;
  const _exercise = myExercises.value.find(
    (exercise) => exercise.id === exerciseId
  );

  if (!_exercise) {
    uiStore.showAlert("warning", "El ejercicio no existe");
    router.push("/mi-cuenta/ejercicios");
    return;
  }

  exercise.value = _exercise;
});
</script>
