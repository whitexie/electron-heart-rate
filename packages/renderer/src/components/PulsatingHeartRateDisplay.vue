<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  heartRate: number;
}>();

const style = computed(() => {
  let newTime = 1000;

  if (props.heartRate > 129) {
    newTime = 500;
  } else if (props.heartRate > 110) {
    newTime = 600;
  } else if (props.heartRate > 100) {
    newTime = 800;
  }

  return {
    'animation-duration': `${newTime}ms`,
  };
});
</script>

<template>
  <div class="my-10px">
    <svg
      width="200"
      height="100"
      viewBox="0,0,64,34"
      style="-webkit-app-region: drag"
    >
      <path
        :style="style"
        class="love"
        d="M20.5,9.5
        c-1.955,0,-3.83,1.268,-4.5,3
        c-0.67,-1.732,-2.547,-3,-4.5,-3
        C8.957,9.5,7,11.432,7,14
        c0,3.53,3.793,6.257,9,11.5
        c5.207,-5.242,9,-7.97,9,-11.5
        C25,11.432,23.043,9.5,20.5,9.5z"
        fill="#E83825"
      ></path>
      <text
        x="28"
        y="23"
        font-size="8"
        font-weight="bold"
        fill="#E83825"
      >
        {{ heartRate }} BPM
      </text>
    </svg>
  </div>
</template>

<style scoped>
@keyframes zoomInOut {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.love {
  transform-origin: center center;
  /* animation: zoomInOut 0.5s infinite; */
  animation-name: zoomInOut;
  animation-iteration-count: infinite;
}
</style>
