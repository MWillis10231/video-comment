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

const emit = defineEmits(['update']);

const settings = ref(DEFAULT_SETTINGS) as Ref<Settings>;

const handleEditSetting = (setting: keyof Settings, newValue: FONT_FAMILIES | ColorValueHex) => {
  settings.value[setting] = newValue;
  storeSettings();
};

const editFont = (newFont: FONT_FAMILIES) => handleEditSetting(SETTINGS_KEY.FONT_FAMILY, newFont);

const fetchStoredSettings = () => {
  settings.value = getStoredSettings()
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
        🗑️
      </button>
    </div>
    
    <p>
      Light/dark mode is toggled via the browser preferences
    </p>

    <section>
      <h3>Font</h3>

      <div class="settingsSection">
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
      </div>

      <div class="settingsSection">
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
</style>
