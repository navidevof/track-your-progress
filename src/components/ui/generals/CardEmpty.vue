<template>
  <div
    class="rounded-lg bg-custom-black-3/50 drop-shadow p-4 flex flex-col gap-y-3 justify-center items-center"
  >
    <div class="bg-custom-gray-1 rounded-full p-4">
      <slot name="icon" />
    </div>
    <p class="text-center font-medium text-pretty">
      <slot name="description" />
    </p>
    <span class="text-white/75 mb-3 text-sm text-pretty">
      <slot name="cta" />
    </span>
  </div>
</template>
