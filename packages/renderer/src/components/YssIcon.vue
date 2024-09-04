<script lang="ts" setup>
withDefaults(
  defineProps<{
    icon: string;
    size?: number;
    width?: number;
    height?: number;
  }>(),
  {
    icon: '',
    size: 0,
    width: 30,
    height: 30,
  },
);
</script>

<template>
  <svg
    :width="size || width"
    :height="size || height"
  >
    <use :xlink:href="`#${icon}`"></use>
  </svg>
</template>

<style scoped></style>
