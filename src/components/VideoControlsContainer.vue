<script setup lang="ts">
import { createTab, getTabId, sendMessageToTab } from '@/chromeTabsService';
import VideoControls from './VideoControls.vue';
import { ref } from 'vue';

const playbackRate = ref(1);

const handlePlay = async () => {
  const tabId = await getTabId();

  if (tabId) {
    await sendMessageToTab(tabId, { action: "play" })
  }
};

const handleSkip = async (time: number) => {
  const tabId = await getTabId();

  if (tabId) {
    await sendMessageToTab(tabId, { action: "seek", time });
  }
};

const handleSetSpeed = async (speed: number) => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: "setSpeed", speed });
    playbackRate.value = response;
  }
};

const handleOpenFullPage = async () => {
  createTab('../../fullpage.html');
};

</script>

<template>
  <VideoControls
    :playbackRate="playbackRate"
    @play="handlePlay"
    @skip="handleSkip"
    @setSpeed="handleSetSpeed"
    @openTest="handleOpenFullPage"
  />
</template>
