<template>
  <ButtonPrimary
    @click="showModal = true"
    type="button"
    class="mx-auto font-medium"
  >
    Asignar ejercicio
  </ButtonPrimary>

  <ModalContainer
    className="!w-10/12 max-w-lg !h-auto"
    v-show="showModal"
    @close="showModal = false"
  >
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-medium text-lg">Asignar ejercicio</h2>
      <label class="flex flex-col gap-y-1">
        <span class="text-sm font-medium">Buscar ejercicio</span>
        <input
          type="search"
          placeholder="Escriba el nombre del ejercicio..."
          v-model="exerciseName"
          class="w-full"
        />
      </label>
      <div class="flex flex-col gap-y-2">
        <header class="flex justify-between items-center">
          <h3 class="font-medium text-sm">Mis ejercicios:</h3>
          <span class="text-sm text-white/75">
            {{
              !exerciseName.trim().length && filteredExercises.length > 5
                ? "(últimos 5 resultados)"
                : ""
            }}
          </span>
        </header>
        <ButtonSecondary
          v-for="exercise in filteredExercises"
          :key="exercise.id"
          class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition"
          @click="assignExercise(exercise)"
        >
          <span>{{ exercise.name }}</span>
        </ButtonSecondary>
        <span
          v-show="!filteredExercises.length && myExercises.length"
          class="text-sm text-white/75"
        >
          No se encontraron ejercicios
          {{
            exerciseName.trim().length
              ? `para tu búsqueda "${exerciseName}".`
              : "."
          }}
        </span>
        <template v-if="!myExercises.length">
          <CardEmpty>
            <template #icon>
              <IconBarbell class="size-8 min-w-8 text-white/75" />
            </template>
            <template #description>
              Parece que no has creado ningún ejercicio.
            </template>
            <template #cta> ¿Te gustaría crear uno? </template>
          </CardEmpty>
          <RouterLink class="mx-auto" :to="`/mi-cuenta/ejercicios`">
            <ButtonPrimary> Crear nuevo ejercicio </ButtonPrimary>
          </RouterLink>
        </template>
      </div>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import { useMyAccountStore } from "@/stores/myAccount";
import { storeToRefs } from "pinia";
import ModalContainer from "@/components/ui/generals/ModalContainer.vue";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import type { IExercise, IMyExercise } from "@/interfaces/exercise";
import IconBarbell from "../icons/IconBarbell.vue";
import CardEmpty from "../ui/generals/CardEmpty.vue";

const myAccountStore = useMyAccountStore();
const { myExercises } = storeToRefs(myAccountStore);

const showModal = ref(false);
const exerciseName = ref("");
const emit = defineEmits(["exercise"]);

const filteredExercises = computed(() => {
  if (!exerciseName.value.trim())
    return myExercises.value
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
  return myExercises.value.filter((exercise) =>
    exercise.id.toLowerCase().includes(formattedUrlSlug(exerciseName.value))
  );
});

const assignExercise = (exercise: IMyExercise) => {
  const newExercise: IExercise = {
    ...exercise,
    series: [],
  };
  emit("exercise", newExercise);
  showModal.value = false;
};
</script>
