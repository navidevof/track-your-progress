<template>
  <ButtonPrimary
    @click="showModal = true"
    type="button"
    class="mx-auto font-medium"
  >
    Agregar ejercicio
  </ButtonPrimary>
  <ModalContainer v-show="showModal" @close="showModal = false">
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-medium text-lg">Agregar nuevo ejercicio</h2>
      <p class="text-sm text-pretty text-white/75">
        Solo los campos marcados con * son obligatorios.
      </p>
      <form @submit.prevent="createExercises" class="flex flex-col gap-4">
        <div class="w-full relative flex flex-col gap-y-3">
          <label class="flex flex-col gap-y-1">
            <span class="text-sm font-medium">Nombre del ejercicio*</span>
            <input
              placeholder="Nombre del ejercicio"
              v-model="newExercise.name"
              required
              class="w-full"
            />
          </label>
          <label class="flex flex-col gap-y-1">
            <span class="text-sm font-medium">Repeticiones</span>
            <input
              type="number"
              min="1"
              placeholder="Repeticiones"
              v-model="newExercise.possibleReps"
              class="w-full"
            />
          </label>
          <label class="flex flex-col gap-y-1">
            <span class="text-sm font-medium">Tiempo de ejecución</span>
            <div class="flex w-full gap-x-1 items-center">
              <input
                placeholder="Tiempo de ejecución"
                v-model="newExercise!.possibleExecutionTime!.value"
                class="w-full"
              />
              <select v-model="newExercise!.possibleExecutionTime!.unit">
                <option :value="TimeUnit.MINUTES">Min</option>
                <option :value="TimeUnit.SECONDS">Seg</option>
              </select>
            </div>
          </label>
          <label class="flex flex-col gap-y-1">
            <span class="text-sm font-medium">Tiempo de descanso</span>
            <div class="flex w-full gap-x-1 items-center">
              <input
                placeholder="Tiempo de descanso"
                v-model="newExercise!.possibleRestTime!.value"
                class="w-full"
              />
              <select v-model="newExercise!.possibleRestTime!.unit">
                <option :value="TimeUnit.MINUTES">Min</option>
                <option :value="TimeUnit.SECONDS">Seg</option>
              </select>
            </div>
          </label>
        </div>
        <ButtonPrimary type="submit" class="mx-auto font-medium">
          Agregar
        </ButtonPrimary>
      </form>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ModalContainer from "@/components/ui/generals/ModalContainer.vue";
import { TimeUnit, type IMyExercise } from "@/interfaces/exercise";
import { storeToRefs } from "pinia";
import { useMyAccountStore } from "@/stores/myAccount";
import { initialMyExercise } from "@/constants/initialValues";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();
const myAccountStore = useMyAccountStore();

const { myExercises } = storeToRefs(myAccountStore);

const newExercise = ref<IMyExercise>(structuredClone(initialMyExercise));
const showModal = ref(false);
const emit = defineEmits(["exercise"]);

// Crear un nuevo ejercicio
const createExercises = () => {
  if (!newExercise.value.name.trim()) return;

  newExercise.value.id = formattedUrlSlug(newExercise.value.name);
  newExercise.value.createdAt = Date.now();

  const exerciseExists = myExercises.value.find(
    (exercise) => exercise.id === newExercise.value.id
  );

  if (exerciseExists) {
    uiStore.showAlert("warning", "El ejercicio ya existe");
    return;
  }

  myAccountStore.myExercises.push(newExercise.value);
  newExercise.value = structuredClone(initialMyExercise);
  showModal.value = false;
  emit(
    "exercise",
    JSON.parse(JSON.stringify({ ...newExercise.value, series: [] }))
  );
};
</script>
