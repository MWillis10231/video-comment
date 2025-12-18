<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import CommentPage from './components/CommentPage.vue';
import { PAGE, SETTINGS_KEY } from './enum';
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
    ref="fullpage"
  >
    <main>
      TEST OPEN NEW PAGE?!

      <CommentPage
        v-if="page === PAGE.COMMENTS"
      />
    </main>
  </div>
</template>
