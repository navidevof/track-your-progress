<template>
  <MainContainer title="Mis ejercicios" showBackButton>
    <SectionContainer>
      <aside
        class="flex items-center gap-x-3"
        v-for="(exercise, idx) in myExercises"
        :key="exercise.id"
      >
        <RouterLink class="w-full" :to="`/mi-cuenta/ejercicios/${exercise.id}`">
          <ButtonSecondary class="w-full text-start">
            <span>{{ exercise.name }}</span>
          </ButtonSecondary>
        </RouterLink>
        <button @click="deleteExercise(idx)">
          <IconTrash
            class="size-5 min-w-4 transition hover:text-custom-error/75"
          />
        </button>
      </aside>
      <div
        class="rounded-lg bg-custom-black-3/50 drop-shadow p-4 flex flex-col gap-y-3 justify-center items-center"
        v-show="!myExercises.length"
      >
        <div class="bg-custom-gray-1 rounded-full p-4">
          <IconBarbell class="size-8 min-w-8 text-white/75" />
        </div>
        <p class="text-center">
          Parece que no has agregado ningún ejercicio aún.
        </p>
        <span class="text-white/75 mb-3 text-sm">
          ¿Te gustaría agregar un ejercicio?
        </span>
      </div>
      <AddNewExercise />
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import AddNewExercise from "@/components/exercise/AddNewExercise.vue";
import IconBarbell from "@/components/icons/IconBarbell.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
import { useMyAccountStore } from "@/stores/myAccount";
import { storeToRefs } from "pinia";

const myAccountStore = useMyAccountStore();
const { myExercises } = storeToRefs(myAccountStore);

const deleteExercise = (idx: number) => {
  myExercises.value.splice(idx, 1);
};
</script>
