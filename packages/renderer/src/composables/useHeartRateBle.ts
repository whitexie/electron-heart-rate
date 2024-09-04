/// <reference types="web-bluetooth" />
import { ref, onMounted } from 'vue';


const HEART_RATE_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';

interface characteristicvaluechangedEvent extends Event {
  isTrusted: boolean
  bubbles: boolean
  cancelBubble: boolean
  cancelable: boolean
  composed: boolean
  currentTarget: BluetoothRemoteGATTCharacteristic
  defaultPrevented: false
  eventPhase: number
  returnValue: boolean
  srcElement: BluetoothRemoteGATTCharacteristic
  target: BluetoothRemoteGATTCharacteristic
  timeStamp: number
  type: string
}

export const enum DeviceStateEnum {
  NOT_FOUND_GATT_SERVICES = -4,
  NOT_SUPPORT = -3,
  NOT_CONNECT = -2,
  FAIL = -1,
  CONNECTING = 0,
  CONNECTED = 1,
  SCANING = 2,
}


export interface Device {
  deviceId: string
  deviceName: string
}
export function useHeartRateBle() {

  const deviceList = ref<Device[]>([]);
  const currentDevice = ref<Device | null>(null);
  const currentService = ref<BluetoothRemoteGATTService | null>(null);
  const characteristic = ref<BluetoothRemoteGATTCharacteristic | null>(null);
  let currentUUID = '';

  const deviceState = ref(DeviceStateEnum.NOT_CONNECT);
  const heartRateNumber = ref(0);

  function startLiteningDeviceListChanged() {
    window.electronAPI.onUpdateDevices((_deviceList) => {
      deviceList.value = _deviceList as Device[];
    });
  }

  async function selectedDevice(device: Device) {
    currentDevice.value = device;
    window.electronAPI.selectedDevice(device.deviceId);
  }

  async function runListeningHeartRateService(device: BluetoothDevice) {
    console.log('runListeningHeartRateService device => ', device);
    if (!device.gatt) {
      resetAll();
      deviceState.value = DeviceStateEnum.NOT_FOUND_GATT_SERVICES;
      throw Error('device.gatt is null');
    }

    console.log('gatt connected => ', device.gatt.connected);

    if (!device.gatt.connected) {
      deviceState.value = DeviceStateEnum.CONNECTING;
      console.log('gatt not connected, start connecting');
      await device.gatt.connect();
      deviceState.value = DeviceStateEnum.CONNECTED;
    }

    console.log('execute  => getPrimaryServices ');
    const services = await device.gatt.getPrimaryServices();
    services.forEach(service => {
      if (currentUUID) {
        return;
      }

      if (service.uuid === HEART_RATE_SERVICE_UUID) {
        currentUUID = service.uuid;
      }
      console.log('current service uuid => ', service.uuid);
    });

    if (!currentUUID) {
      throw Error('未找到匹配的服务');
    }

    const service = await device.gatt.getPrimaryService(currentUUID);
    currentService.value = service;

    const characteristics = await service.getCharacteristics();

    // 监听 GATT 服务器断开连接事件
    device.addEventListener('gattserverdisconnected', onDisconnected);

    if (characteristics.length < 1) {
      console.error('characteristics length is 0');
      return;
    }

    characteristic.value = characteristics[0];

    // 开始监听心率测量
    characteristic.value.startNotifications();

    characteristic.value.addEventListener('characteristicvaluechanged', handleHeartRateMeasurement);
  }

  // 处理心率测量数据
  function handleHeartRateMeasurement(event: Event) {
    // console.log('handleHeartRateMeasurement event => ', event);
    const value: DataView = (event as characteristicvaluechangedEvent).target.value!;
    // 心率值通常以bpm为单位，位于数组的第二个字节
    const heartRate = value.getUint8(1);
    let length = 0;
    const data = [];
    while (length < value.byteLength) {
      data.push(value.getUint8(length));
      length++;
    }

    console.log('data => ', data);
    heartRateNumber.value = heartRate;
  }


  function onDisconnected() {
    console.log('onDisconnected');
    resetAll();
  }

  function resetAll() {
    deviceState.value = DeviceStateEnum.FAIL;
    currentDevice.value = null;
    currentUUID = '';
    heartRateNumber.value = 0;
    deviceState.value = DeviceStateEnum.NOT_CONNECT;

    if (characteristic.value) {
      characteristic.value.removeEventListener('characteristicvaluechanged', handleHeartRateMeasurement);
      characteristic.value = null;
    }

  }

  async function scanHeartRateBleDevices() {
    if (!navigator?.bluetooth) {
      deviceState.value = DeviceStateEnum.NOT_SUPPORT;
      throw Error('当前设备不支持蓝牙');
    }

    deviceState.value = DeviceStateEnum.SCANING;
    const device = await navigator.bluetooth.requestDevice({
      // acceptAllDevices: true,
      filters: [{ services: ['heart_rate'] }],
      optionalServices: ['heart_rate'],
    });
    runListeningHeartRateService(device);
  }


  onMounted(() => {
    startLiteningDeviceListChanged();
  });

  return {
    deviceList,
    currentDevice,
    heartRateNumber,
    deviceState,
    selectedDevice,
    scanHeartRateBleDevices,
  };
}
