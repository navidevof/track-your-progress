<script setup lang="ts">
import IconHistory from "@/components/icons/IconHistory.vue";
import CardEmpty from "@/components/ui/generals/CardEmpty.vue";
import MainContainer from "@/components/ui/generals/MainContainer.vue";
import SectionContainer from "@/components/ui/generals/SectionContainer.vue";
</script>

<template>
  <MainContainer title="Mi progreso">
    <SectionContainer>
      <CardEmpty>
        <template #icon>
          <IconHistory class="size-8 min-w-8" />
        </template>
        <template #description>
          Próximamente te mostraré el progreso de tus ejercicios
        </template>
      </CardEmpty>
    </SectionContainer>
  </MainContainer>
</template>
