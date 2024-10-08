import { defineConfig, transformerVariantGroup, presetUno } from 'unocss';

export default defineConfig({
  presets: [presetUno()],
  transformers: [transformerVariantGroup()],
});
