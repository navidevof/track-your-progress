<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useProgressStore } from "./stores/progress";
import { onMounted } from "vue";
import { getLocalISODate } from "./utils/GetLocalDate";

const progressStore = useProgressStore();
const { selectedDate, selectedDay } = storeToRefs(progressStore);

onMounted(() => {
  selectedDate.value = getLocalISODate(new Date());
  console.log({
    selectedDay: selectedDay.value,
    selectedDate: selectedDate.value,
  });
});
</script>
