<template>
  <router-view></router-view>
  <Navbar />
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useProgressStore } from "./stores/progress";
import { onMounted } from "vue";
import { getLocalISODate } from "./utils/GetLocalDate";
import Navbar from "./components/common/Navbar.vue";

const progressStore = useProgressStore();
const { selectedDate } = storeToRefs(progressStore);

onMounted(() => {
  selectedDate.value = getLocalISODate(new Date());
});
</script>
