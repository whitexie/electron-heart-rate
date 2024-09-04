<script lang="ts" setup>
</script>

<template>
  <div class="device-manage fixed left-10px bottom-4 flex items-center h-40px rounded-40px bg-gray-300">
    <slot></slot>
  </div>
</template>

<style scoped>
.device-manage {
  width: calc(100% - 20px);
}
</style>
