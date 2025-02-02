<template>
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useProgressStore } from "./stores/progress";
import { onMounted } from "vue";
import { getLocalISODate } from "./utils/GetLocalDate";

const progressStore = useProgressStore();
const { selectedDate } = storeToRefs(progressStore);

onMounted(() => {
  selectedDate.value = getLocalISODate(new Date());
});
</script>
