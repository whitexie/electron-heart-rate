<script lang="ts" setup>
/// <reference types="web-bluetooth" />

import YssIcon from './components/YssIcon.vue';
import DeivceManage from './components/DeivceManage.vue';
import DeviceList from './components/DeviceList.vue';
import PulsatingHeartRateDisplay from './components/PulsatingHeartRateDisplay.vue';
import type {Device} from './composables/useHeartRateBle';
import {useHeartRateBle, DeviceStateEnum} from './composables/useHeartRateBle';
import {useWindowFocusOrBlur} from './composables/useWindowFocusOrBlur';

const {isFocus} = useWindowFocusOrBlur();
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
      <DeivceManage class="p-1 bg-gray-100 rounded-lg shadow-md">
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
        </div>
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

.divce-list {
  transform: translateY(60px);
}

.yss-button {
  padding: 4px 10px;
  border-radius: 5px;
  border: 0px;
  cursor: pointer;
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
