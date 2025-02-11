<template>
  <ButtonPrimary
    @click="showModal = true"
    type="button"
    class="mx-auto font-medium"
  >
    Agregar rutina
  </ButtonPrimary>
  <ModalContainer v-show="showModal" @close="showModal = false">
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-medium text-lg">Agregar rutina</h2>
      <p class="text-sm text-pretty text-white/75">
        Escribe el nombre de la rutina y da clic en agregar.
      </p>
      <form @submit.prevent="createRoutine" class="flex flex-col gap-4">
        <div class="w-full relative flex flex-col gap-y-3">
          <label class="flex flex-col gap-y-1">
            <span class="text-sm font-medium">Nombre</span>
            <input
              placeholder="Nombre de la rutina"
              v-model="newRoutine.name"
              required
              class="w-full"
            />
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
import { storeToRefs } from "pinia";
import { useMyAccountStore } from "@/stores/myAccount";
import { initialMyRoutine } from "@/constants/initialValues";
import { useUIStore } from "@/stores/ui";
import type { IMyRoutine } from "@/interfaces/routine";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import { useRouter } from "vue-router";

const uiStore = useUIStore();
const router = useRouter();
const myAccountStore = useMyAccountStore();

const { myRoutines } = storeToRefs(myAccountStore);

const newRoutine = ref<IMyRoutine>(structuredClone(initialMyRoutine));
const showModal = ref(false);

const createRoutine = () => {
  if (!newRoutine.value.name.trim()) return;

  const id = formattedUrlSlug(newRoutine.value.name);
  newRoutine.value.id = id;
  newRoutine.value.createdAt = Date.now();

  const routineExists = myRoutines.value.find((routine) => routine.id === id);

  if (routineExists) {
    uiStore.showAlert("warning", "La rutina ya existe");
    return;
  }

  myAccountStore.myRoutines.push(newRoutine.value);
  newRoutine.value = structuredClone(initialMyRoutine);
  showModal.value = false;
  router.push(`/mi-cuenta/rutinas/${id}`);
};
</script>
