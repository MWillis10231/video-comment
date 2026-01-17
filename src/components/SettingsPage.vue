<script setup lang="ts">
import { FONT_FAMILIES_MAP } from '@/constants';
import { FONT_FAMILIES, SETTINGS_KEY } from '@/enum';
import {
  DEFAULT_SETTINGS,
  getStoredSettings,
  removeSettings,
  setSettings,
} from '@/settingsService';
import {
  ref,
  type Ref
} from 'vue';
import type { ColorValueHex, Settings } from '@/types';
import DeleteForeverIcon from './Icons/DeleteForeverIcon.vue';

const emit = defineEmits(['update']);

const settings = ref(DEFAULT_SETTINGS) as Ref<Settings>;

const handleEditSetting = (setting: keyof Settings, newValue: FONT_FAMILIES | ColorValueHex) => {
  settings.value[setting] = newValue;
  storeSettings();
};

const editFont = (newFont: FONT_FAMILIES) => handleEditSetting(SETTINGS_KEY.FONT_FAMILY, newFont);

const fetchStoredSettings = () => {
  const storedSEttings = getStoredSettings();

  settings.value = {
    ...DEFAULT_SETTINGS,
    ...storedSEttings,
  };
}

const storeSettings = () => {
  setSettings(settings.value);
  emit('update');
};

const removeAllSettings = () => {
  if (window.confirm(`Remove all settings?`)) {
    removeSettings();
    emit('update');
    fetchStoredSettings();
  }
}

fetchStoredSettings();
</script>

<template>
  <div class="container">
    <h2>Settings page</h2>

    <div>
      <button @click="removeAllSettings">
        <DeleteForeverIcon class="icon" /> Delete all settings
      </button>
    </div>

    <p>
      Light/dark mode is toggled via the browser preferences
    </p>

    <section>
      <h3>Extra Timestamp padding</h3>

      <div class="settingsSection">
        <label>
          Start padding (seconds) - deducted from start timestamps

          <input
            type="number"
            max="0"
            :value="settings[SETTINGS_KEY.START_TIMESTAMP_PADDING]"
            @change="handleEditSetting(SETTINGS_KEY.START_TIMESTAMP_PADDING, $event.target.value)"
          />
        </label>
      </div>
    </section>

    <section>
      <h3>Font</h3>

      <div class="settingsSection grid">
        <button
          v-for="(fontFamily, index) in FONT_FAMILIES_MAP"
          :key="index"
          :class="['button', { active: settings[SETTINGS_KEY.FONT_FAMILY] === index }]"
          :style="{ fontFamily: fontFamily.value }"
          @click="editFont(index)"
        >
          {{ fontFamily.name }}
        </button>
      </div>
    </section>

    <section>
      <h3>Color</h3>

      <div class="settingsSection">
        <label>
          Light highlight color

          <input
            type="color"
            :value="settings[SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR]"
            @change="handleEditSetting(SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR, $event.target.value)"
          />
        </label>

        <label>
          Dark highlight color

          <input
            type="color"
            :value="settings[SETTINGS_KEY.DARK_HIGHLIGHT_COLOR]"
            @change="handleEditSetting(SETTINGS_KEY.DARK_HIGHLIGHT_COLOR, $event.target.value)"
          />
        </label>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .settingsSection {
    display: flex;
    gap: 0.5rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
</style>
