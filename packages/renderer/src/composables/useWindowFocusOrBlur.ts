import { ref, onMounted, watch } from 'vue';
export function useWindowFocusOrBlur() {

  const isFocus = ref(true);

  watch(() => isFocus.value, (newValue) => {
    console.log('isFocus', newValue);
    const appElement: HTMLElement | null = document.querySelector('#app');
    if(appElement?.style) {
      appElement.style.backgroundColor = newValue ? 'white' : 'transparent';
    }
  });

  onMounted(() => {
    window.electronAPI.onWindowBlurOrFocus((_isFocus: boolean) => {
      isFocus.value = _isFocus;
    });
  });

  return {
    isFocus,
  };
}
