<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import CommentPage from './components/CommentPage.vue';
import { PAGE, SETTINGS_KEY } from './enum';
import AboutPage from './components/AboutPage.vue';
import SettingsPage from './components/SettingsPage.vue';
import { DEFAULT_SETTINGS, getSettingsValue } from './settingsService';
import { FONT_FAMILIES_MAP } from './constants';

const page = ref(PAGE.COMMENTS);
const app = useTemplateRef('app');

const getNewSettings = () => {
  const fontSetting = getSettingsValue(SETTINGS_KEY.FONT_FAMILY) ?? DEFAULT_SETTINGS.fontFamily;
  const darkHighlightColor = getSettingsValue(SETTINGS_KEY.DARK_HIGHLIGHT_COLOR) ?? DEFAULT_SETTINGS.darkHighlightColor;
  const lightHighlightColor = getSettingsValue(SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR) ?? DEFAULT_SETTINGS.lightHighlightColor;

  if (app) {
    app.value?.style.setProperty('--font-family', FONT_FAMILIES_MAP[fontSetting].value);
    app.value?.style.setProperty('--dark-highlight-color', darkHighlightColor);
    app.value?.style.setProperty('--light-highlight-color', lightHighlightColor);
  }
}

getNewSettings();
</script>

<template>
  <div class="app"
    ref="app"
  >
    <nav>
      <button
        :class="['button', { active: page === PAGE.COMMENTS }]"
        :disabled="page === PAGE.COMMENTS"
        @click="page = PAGE.COMMENTS"
      >
        Comments 💬
      </button>

      <button
        :class="['button', { active: page === PAGE.SETTINGS }]"
        :disabled="page === PAGE.SETTINGS"
        @click="page = PAGE.SETTINGS"
      >
        Settings ⚙️
      </button>

      <button
        :class="['button', { active: page === PAGE.ABOUT }]"
        :disabled="page === PAGE.ABOUT"
        @click="page = PAGE.ABOUT"
      >
        About ℹ️
      </button>
    </nav>

    <main>
      <CommentPage 
        v-if="page === PAGE.COMMENTS"
      />

      <SettingsPage 
        v-if="page === PAGE.SETTINGS" 
        @update="getNewSettings"
      />

      <AboutPage v-if="page === PAGE.ABOUT" />
    </main>
  </div>
</template>