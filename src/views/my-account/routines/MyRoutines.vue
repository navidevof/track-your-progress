<template>
  <MainContainer title="Mis rutinas" showBackButton>
    <SectionContainer>
      <aside
        class="flex items-center gap-x-3 w-full"
        v-for="(routine, idx) in myRoutines"
        :key="idx"
      >
        <RouterLink :to="`/mi-cuenta/rutinas/${routine.id}`" class="w-full">
          <ButtonSecondary class="w-full text-start">
            {{ routine.name }}
          </ButtonSecondary>
        </RouterLink>
        <button @click="deleteRoutine(idx)">
          <IconTrash
            class="size-5 min-w-4 transition hover:text-custom-error/75"
          />
        </button>
      </aside>
      <CardEmpty v-show="!myRoutines.length">
        <template #icon>
          <IconClipboardList class="size-8 min-w-8 text-white/75" />
        </template>
        <template #description>
          Parece que no has agregado ninguna rutina aún.
        </template>
        <template #cta> ¿Te gustaría crear una nueva? </template>
      </CardEmpty>
      <AddNewRoutine />
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import IconClipboardList from "@/components/icons/IconClipboardList.vue";
import IconTrash from "@/components/icons/IconTrash.vue";
import AddNewRoutine from "@/components/routine/AddNewRoutine.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import CardEmpty from "@/components/ui/generals/CardEmpty.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";

import { useMyAccountStore } from "@/stores/myAccount";
import { storeToRefs } from "pinia";

const myAccountStore = useMyAccountStore();
const { myRoutines } = storeToRefs(myAccountStore);

const deleteRoutine = (idx: number) => {
  myRoutines.value.splice(idx, 1);
};
</script>
