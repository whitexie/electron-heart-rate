<script lang="ts" setup>
import type { Device } from '../composables/useHeartRateBle';

defineProps<{
  deviceList: Device[];
}>();

const emits = defineEmits<{
  (event: 'click', device: Device): void;
}>();

const onSelectDevice = (device: Device) => {
  emits('click', device);
};
</script>

<template>
  <div
    v-for="item in deviceList"
    :key="item.deviceId"
    class="device-item p-3 bg-white rounded-md shadow hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
    @click="onSelectDevice(item)"
  >
    <div>
      <div class="font-medium">设备名称：{{ item.deviceName }}</div>
      <div class="text-gray-600 text-sm mt-1">设备地址：{{ item.deviceId }}</div>
    </div>
    <YssIcon
      :size="20"
      icon="icon-arrow-right"
      class="text-gray-400"
    />
  </div>
</template>

<style scoped>
.device-list {
  width: 100%;
  height: 100%;
}

.device-item:not(:first-child) {
  margin-top: 10px;
}

.device-item {
  padding: 10px 20px;
  border-radius: 10px;
  background-color: buttonface;
  cursor: pointer;
}

.device-item:not(:first-child) {
  margin-top: 10px;
}
</style>
