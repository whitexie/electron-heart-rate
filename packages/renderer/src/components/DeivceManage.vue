<script lang="ts" setup>
import YssIcon from './YssIcon.vue';

import { type Device, DeviceStateEnum } from '../composables/useHeartRateBle';

const { currentDevice } = defineProps<{
  deviceList: Device[];
  deviceState: DeviceStateEnum;
  currentDevice: null | Device;
}>();

const emits = defineEmits<{
  (e: 'click-scan'): void;
  (e: 'selected-device', device: Device): void;
}>();

function connectBluetooth() {
  emits('click-scan');
}
</script>

<template>
  <div
    class="device-manage fixed left-10px bottom-4 flex items-center h-40px rounded-40px bg-gray-300"
  >
    <div class="flex px-1 justify-between w-full items-center relative">
      <div class="text-16px font-semibold flex items-center">
        当前设备：{{ currentDevice?.deviceName || '未连接' }}
      </div>

      <div class="flex items-center">
        <button
          v-if="deviceState === DeviceStateEnum.NOT_CONNECT"
          class="flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors my-1"
          @click="connectBluetooth"
        >
          <YssIcon
            :size="16"
            icon="icon-duanbochelanya"
            class="mr-1.5"
          />
          连接
        </button>
        <template v-if="deviceState === DeviceStateEnum.SCANING">
          <YssIcon
            :size="24"
            icon="icon-loading"
            class="loading text-blue-500"
          />
        </template>
      </div>
      <slot> </slot>
    </div>
  </div>
</template>

<style scoped>
.device-manage {
  width: calc(100% - 20px);
}
</style>
