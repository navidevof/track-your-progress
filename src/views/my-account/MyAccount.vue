<template>
  <MainContainer title="Mi cuenta">
    <SectionContainer>
      <h2 class="text-lg font-medium">Rutinas y ejercicios</h2>
      <div class="rounded-lg overflow-hidden divide-y divide-custom-gray-1">
        <RouterLink
          to="/mi-cuenta/ejercicios"
          class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition justify-between"
        >
          <div class="flex items-center gap-x-2">
            <IconBarbell class="size-5 min-w-5" /> Mis ejercicios
          </div>
          <IconChevron class="size-4 min-w-4 rotate-180" />
        </RouterLink>
        <RouterLink
          to="/mi-cuenta/rutinas"
          class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition justify-between"
        >
          <div class="flex items-center gap-x-2">
            <IconClipboardList class="size-5 min-w-5" /> Mis rutinas
          </div>
          <IconChevron class="size-4 min-w-4 rotate-180" />
        </RouterLink>
      </div>
    </SectionContainer>
    <SectionContainer v-if="false">
      <h2 class="text-lg font-medium">Mis medidas</h2>
      <div class="rounded-lg overflow-hidden divide-y divide-custom-gray-1">
        <RouterLink
          to="/mi-cuenta/ejercicios"
          class="flex items-center justify-between gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition"
        >
          <div class="flex items-center gap-x-2">
            <IconScale class="size-5 min-w-5" /> Mi peso
          </div>
          <IconChevron class="size-4 min-w-4 rotate-180" />
        </RouterLink>
        <RouterLink
          to="/mi-cuenta/rutinas"
          class="flex items-center gap-x-2 w-full bg-custom-black-3 hover:!bg-custom-gray-1 text-start py-3 px-4 text-white/75 hover:text-white transition justify-between"
        >
          <div class="flex items-center gap-x-2">
            <IconRuler class="size-5 min-w-5" /> Mis medidas
          </div>
          <IconChevron class="size-4 min-w-4 rotate-180" />
        </RouterLink>
      </div>
    </SectionContainer>
  </MainContainer>
</template>

<script setup lang="ts">
import IconBarbell from "@/components/icons/IconBarbell.vue";
import IconChevron from "@/components/icons/IconChevron.vue";
import IconClipboardList from "@/components/icons/IconClipboardList.vue";
import IconRuler from "@/components/icons/IconRuler.vue";
import IconScale from "@/components/icons/IconScale.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
</script>
