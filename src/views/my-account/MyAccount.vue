<template>
  <MainContainer title="Mi cuenta">
    <SectionContainer>
      <h2 class="text-lg font-medium">Rutinas y ejercicios</h2>
      <div class="rounded-lg overflow-hidden divide-y divide-custom-gray-1">
        <RouterLink
          to="/mi-cuenta/ejercicios"
          class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition"
        >
          <IconBarbell class="size-5 min-w-5" /> Mis ejercicios
        </RouterLink>
        <button
          type="button"
          class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition"
        >
          <IconClipboardList class="size-5 min-w-5" /> Mis rutinas
        </button>
      </div>
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import IconBarbell from "@/components/icons/IconBarbell.vue";
import IconClipboardList from "@/components/icons/IconClipboardList.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
</script>
