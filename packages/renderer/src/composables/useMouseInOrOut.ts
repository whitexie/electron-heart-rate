import { ref, onMounted, onUnmounted } from 'vue';
export function useMouseInOrOut() {

  const isMouseIn = ref(false);

  function handleMouseIn() {
    isMouseIn.value = true;
  }

  function handleMouseOut() {
    isMouseIn.value = false;

  }


  onMounted(() => {
    window.addEventListener('mouseenter', handleMouseIn);

    window.addEventListener('mouseleave', handleMouseOut);
  });

  onUnmounted(() => {
    window.removeEventListener('mouseenter', handleMouseIn);
    window.removeEventListener('mouseleave', handleMouseOut);
  });

  return {
    isMouseIn,
  };
}
