<script lang="ts" setup>
/// <reference types="web-bluetooth" />

import DeivceManage from './components/DeivceManage.vue';
import DeviceList from './components/DeviceList.vue';
import PulsatingHeartRateDisplay from './components/PulsatingHeartRateDisplay.vue';
import type { Device } from './composables/useHeartRateBle';
import { useHeartRateBle, DeviceStateEnum } from './composables/useHeartRateBle';
import { useWindowFocusOrBlur } from './composables/useWindowFocusOrBlur';

const { isFocus } = useWindowFocusOrBlur();
const {
  deviceList,
  heartRateNumber,
  currentDevice,
  deviceState,
  selectedDevice,
  scanHeartRateBleDevices,
} = useHeartRateBle();

async function connectBluetooth() {
  scanHeartRateBleDevices();
}

function onSelectDevice(item: Device) {
  selectedDevice(item);
}
</script>

<template>
  <div class="main-content px-10px">
    <PulsatingHeartRateDisplay :heart-rate="heartRateNumber" />

    <template v-if="isFocus">
      <DeivceManage
        :device-list="deviceList"
        :current-device="currentDevice"
        :device-state="deviceState"
        class="p-1 bg-gray-100 rounded-lg shadow-md"
        @click-scan="connectBluetooth"
        @selected-device="onSelectDevice"
      >
        <transition name="slide-up">
          <div
            v-show="deviceState === DeviceStateEnum.SCANING && deviceList.length"
            class="panel-content absolute left-0 top-0 rounded max-h-80"
          >
            <DeviceList
              :device-list="deviceList"
              @click="onSelectDevice"
            />
          </div>
        </transition>
      </DeivceManage>
    </template>
  </div>
</template>

<style scoped>
.main-content {
  height: 100%;
}

.border-bar {
  -webkit-app-region: drag;
  height: 10px;
  background-color: white;
}

@keyframes loading {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading {
  animation: loading 1s linear infinite;
}

.panel-content {
  width: 100%;
  padding: 10px;
  transform: translateY(calc(-100% - 20px));
  overflow-y: auto;
  background-color: #f5f5f5;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.panel-content::-webkit-scrollbar {
  display: none; /* 适用于Chrome、Safari和Opera */
}
</style>
<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
