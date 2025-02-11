import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/historial",
    name: "History",
    component: () => import("@/views/History.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/progreso",
    name: "Progress",
    component: () => import("@/views/Progress.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/mi-cuenta",
    name: "Account",
    component: () => import("@/views/my-account/_layout.vue"),
    children: [
      {
        path: "/mi-cuenta",
        name: "MyAccount",
        component: () => import("@/views/my-account/MyAccount.vue"),
      },
      {
        path: "/mi-cuenta/ejercicios",
        name: "MyExercises",
        component: () => import("@/views/my-account/exercises/MyExercises.vue"),
      },
      {
        path: "/mi-cuenta/ejercicios/:exerciseId",
        name: "EditExercise",
        component: () =>
          import("@/views/my-account/exercises/EditExercise.vue"),
      },
      {
        path: "/mi-cuenta/rutinas",
        name: "MyRoutines",
        component: () => import("@/views/my-account/routines/MyRoutines.vue"),
      },
      {
        path: "/mi-cuenta/rutinas/:routineId",
        name: "EditRoutine",
        component: () => import("@/views/my-account/routines/EditRoutine.vue"),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/ejercicio/:exerciseId",
    name: "Exercise",
    component: () => import("@/views/Exercise.vue"),
    meta: {
      requiresAuth: false,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
