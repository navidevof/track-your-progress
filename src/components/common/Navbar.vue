<template>
  <nav class="bg-custom-black-3 fixed bottom-0 left-0 w-full py-4">
    <ul
      class="flex items-center justify-between gap-x-3 w-5/6 mx-auto max-w-md"
    >
      <li v-for="item in menu" :key="item.name">
        <router-link
          :to="item.path"
          class="text-custom-white-1/50 hover:text-custom-white-1 flex flex-col justify-center items-center font-medium transition"
          active-class="!text-custom-white-1"
        >
          <component :is="item.component" class="size-6 min-w-6" />
          <span class="text-sm">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { markRaw } from "vue";
import IconHistory from "../icons/IconHistory.vue";
import IconBarbell from "../icons/IconBarbell.vue";
import IconTimeline from "../icons/IconTimeline.vue";
import IconPerson from "../icons/IconPerson.vue";

const menu = markRaw([
  { component: IconHistory, name: "Historial", path: "/historial" },
  { component: IconBarbell, name: "Ejercicios", path: "/" },
  { component: IconTimeline, name: "Progreso", path: "/progreso" },
  { component: IconPerson, name: "Mi cuenta", path: "/mi-cuenta" },
]);
</script>
