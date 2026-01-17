<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import CommentPage from './components/CommentPage.vue';
import { PAGE, SETTINGS_KEY } from './enum';
import AboutPage from './components/AboutPage.vue';
import SettingsPage from './components/SettingsPage.vue';
import { DEFAULT_SETTINGS, getSettingsValue, getStoredSettings, setSettings } from './settingsService';
import { FONT_FAMILIES_MAP } from './constants';
import ImportPage from './components/ImportPage.vue';
import { getTabId, sendMessageToTab } from './chromeTabsService';
import CommentsIcon from './components/Icons/CommentsIcon.vue';
import SettingsIcon from './components/Icons/SettingsIcon.vue';
import ImportIcon from './components/Icons/ImportIcon.vue';
import InfoIcon from './components/Icons/InfoIcon.vue';

const page = ref(PAGE.COMMENTS);
const app = useTemplateRef('app');
const shouldRefresh = ref(false);
const isLoading = ref(false);

const getNewSettings = () => {
  const fontSetting = getSettingsValue(SETTINGS_KEY.FONT_FAMILY) ?? DEFAULT_SETTINGS.fontFamily;
  const darkHighlightColor = getSettingsValue(SETTINGS_KEY.DARK_HIGHLIGHT_COLOR) ?? DEFAULT_SETTINGS.darkHighlightColor;
  const lightHighlightColor = getSettingsValue(SETTINGS_KEY.LIGHT_HIGHLIGHT_COLOR) ?? DEFAULT_SETTINGS.lightHighlightColor;
  const storedPage = getSettingsValue(SETTINGS_KEY.OPEN_PAGE);

  page.value = storedPage;

  if (app) {
    app.value?.style.setProperty('--font-family', FONT_FAMILIES_MAP[fontSetting].value);
    app.value?.style.setProperty('--dark-highlight-color', darkHighlightColor);
    app.value?.style.setProperty('--light-highlight-color', lightHighlightColor);
  }
}

const isTabAvailable = async () => {
  const tabId = await getTabId();

  let response;

  if (tabId) {
    response = await sendMessageToTab(tabId, { action: "getTime" });
  }

  return response !== undefined;
}

const handleLoad = async () => {
  shouldRefresh.value = false;
  isLoading.value = true;

  try {
    await isTabAvailable();
  } catch (error) {
    shouldRefresh.value = true;

    throw error;
  } finally {
    isLoading.value = false;
  }
}

const changePage = (newPage: PAGE) => {
  const oldSettings = getStoredSettings();

  page.value = newPage;

  const newSettings = {
    ...oldSettings,
    [SETTINGS_KEY.OPEN_PAGE]: newPage,
  }

  console.log(newSettings);

  setSettings(newSettings);
}

getNewSettings();
handleLoad();
</script>

<template>
  <div class="app"
    ref="app"
  >
    <main
      v-if="isLoading"
      class="loading"
    >
      <h1>Loading...</h1>
      <p class="loader" />
      <p>Please wait while the extension is loading.</p>
    </main>

    <main
      v-if="shouldRefresh"
      class="error"
    >
        <h1>⚠️ Tab not available ⚠️</h1>
        <p>
          Please reload the Browser tab/page and wait until loading finished. Then close and open the extension.
          <br />
          Or click the button below to refresh the extension.
          <br />
          If the problem persists, please check if the extension is installed correctly.
        </p>

        <button
          class="button"
          @click="handleLoad"
        >
          🔃 Reload extension
        </button>
    </main>

    <template v-else>
      <nav>
      <button
        :class="['button', { active: page === PAGE.COMMENTS }]"
        :disabled="page === PAGE.COMMENTS"
        @click="changePage(PAGE.COMMENTS)"
      >
        Comments <CommentsIcon class="icon" />
      </button>

      <button
        :class="['button', { active: page === PAGE.SETTINGS }]"
        :disabled="page === PAGE.SETTINGS"
        @click="changePage(PAGE.SETTINGS)"
      >
        Settings <SettingsIcon class="icon" />
      </button>

      <button
        :class="['button', { active: page === PAGE.IMPORT }]"
        :disabled="page === PAGE.IMPORT"
        @click="changePage(PAGE.IMPORT)"
      >
        Import <ImportIcon class="icon" />
      </button>

      <button
        :class="['button', { active: page === PAGE.ABOUT }]"
        :disabled="page === PAGE.ABOUT"
        @click="changePage(PAGE.ABOUT)"
      >
        About <InfoIcon class="icon" />
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

      <ImportPage
        v-if="page === PAGE.IMPORT"
      />

      <AboutPage v-if="page === PAGE.ABOUT" />
    </main>
    </template>
  </div>
</template>

<style scoped>
  .loading, .error {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    height: 100vh;
  }

  .loader {
    width: fit-content;
    font-size: 50px;
    clip-path: inset(0 100% 0 0);
    animation: loader 2s steps(4) infinite;

    &:before {
      content: "⚽⚽⚽";
    }
  }

  @keyframes loader {
    to {
      clip-path: inset(0 -55px 0 0)
    }
  }
</style>
