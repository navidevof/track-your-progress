<template>
  <ButtonPrimary
    @click="showModal = true"
    type="button"
    class="mx-auto font-medium"
    :class="buttonClass"
  >
    <slot name="button-text">Asignar rutina</slot>
  </ButtonPrimary>
  <ModalContainer v-show="showModal" @close="showModal = false">
    <div class="flex flex-col gap-y-4">
      <h2 class="text-center font-medium text-lg">Asignar rutina</h2>
      <template v-if="myRoutines.length" key="asignar-rutina">
        <label class="flex flex-col gap-y-1">
          <span class="text-sm font-medium">Buscar rutina</span>
          <input
            type="search"
            placeholder="Escriba el nombre de la rutina..."
            v-model="routineName"
            class="w-full"
          />
        </label>
        <div class="flex flex-col gap-y-2">
          <header class="flex justify-between items-center">
            <h3 class="font-medium text-sm">Mis rutinas:</h3>
            <span class="text-sm text-white/75">
              {{
                !routineName.trim().length && filteredRoutines.length > 5
                  ? "(últimos 5 resultados)"
                  : ""
              }}
            </span>
          </header>
          <ButtonSecondary
            v-for="routine in filteredRoutines"
            :key="routine.id"
            class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition"
            @click="assignRoutine(routine.id)"
          >
            <span>{{ routine.name }}</span>
          </ButtonSecondary>
          <span v-show="!filteredRoutines.length" class="text-sm text-white/75">
            No se encontraron ejercicios
            {{
              routineName.trim().length
                ? `para tu búsqueda "${routineName}"`
                : ""
            }}.
          </span>
        </div>
      </template>
      <template v-else key="empty">
        <CardEmpty>
          <template #icon>
            <IconClipboardList class="size-8 min-w-8 text-white/75" />
          </template>
          <template #description>
            Parece que no has creado ninguna rutina.
          </template>
          <template #cta> ¿Te gustaría crear una? </template>
        </CardEmpty>
        <RouterLink class="mx-auto" :to="`/mi-cuenta/rutinas`">
          <ButtonPrimary> Crear nueva rutina </ButtonPrimary>
        </RouterLink>
      </template>
    </div>
  </ModalContainer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ModalContainer from "@/components/ui/generals/ModalContainer.vue";
import { storeToRefs } from "pinia";
import { useMyAccountStore } from "@/stores/myAccount";
import formattedUrlSlug from "@/utils/FormattedUrlSlug";
import CardEmpty from "../ui/generals/CardEmpty.vue";
import IconClipboardList from "../icons/IconClipboardList.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";
import { useProgressStore } from "@/stores/progress";

interface Props {
  buttonClass?: string;
}

defineProps<Props>();

const progressStore = useProgressStore();
const myAccountStore = useMyAccountStore();

const { assignedRoutines, selectedDay, routine } = storeToRefs(progressStore);
const { myRoutines } = storeToRefs(myAccountStore);

const showModal = ref(false);
const routineName = ref("");

const filteredRoutines = computed(() => {
  if (!routineName.value.trim())
    return myRoutines.value
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
  return myRoutines.value.filter((routine) =>
    routine.id.toLowerCase().includes(formattedUrlSlug(routineName.value))
  );
});

const assignRoutine = (routineId: string) => {
  if (assignedRoutines.value[selectedDay.value]) {
    const newRoutine = myRoutines.value.find(
      (routine) => routine.id === routineId
    );

    if (!newRoutine || !routine.value) return;

    routine.value.exercises = JSON.parse(JSON.stringify(newRoutine.exercises));
  }

  if (!routine.value) return;

  assignedRoutines.value[selectedDay.value] = routineId;
  routine.value.id = routineId;

  showModal.value = false;
  progressStore.findRoutine();
};
</script>
