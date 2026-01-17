<script setup lang="ts">
import { createTab, getTabId, sendMessageToTab } from '@/chromeTabsService';
import VideoControls from './VideoControls.vue';
import { computed, ref } from 'vue';
import { PLAYBACK_SPEEDS, SKIP_INTERVALS } from '@/enum';

const SPEEDS_ARRAY = [
  PLAYBACK_SPEEDS.QUARTER,
  PLAYBACK_SPEEDS.HALF,
  PLAYBACK_SPEEDS.THREE_QUARTERS,
  PLAYBACK_SPEEDS.NORMAL,
  PLAYBACK_SPEEDS.ONE_AND_QUARTER,
  PLAYBACK_SPEEDS.ONE_AND_HALF,
  PLAYBACK_SPEEDS.ONE_AND_THREE_QUARTERS,
  PLAYBACK_SPEEDS.DOUBLE,
];
const minimumSpeed = 0
const maximumSpeed = SPEEDS_ARRAY.length - 1

const playbackRate = ref(PLAYBACK_SPEEDS.NORMAL);
const playing = ref(false)
const muted = ref(false);

const currentSpeedIndex = computed(() => SPEEDS_ARRAY.indexOf(playbackRate.value))
const isCurrentSpeedAtMaximum = computed(() => currentSpeedIndex.value === maximumSpeed)
const isCurrentSpeedAtMinimum = computed(() => currentSpeedIndex.value === minimumSpeed)

const handleIncreaseSpeed = () => {
  if (!isCurrentSpeedAtMaximum.value) {
    handleSetSpeed(SPEEDS_ARRAY[currentSpeedIndex.value + 1])
  }
}

const handleDecreaseSpeed = () => {
  if (!isCurrentSpeedAtMinimum.value) {
    handleSetSpeed(SPEEDS_ARRAY[currentSpeedIndex.value - 1])
  }
}

const handleResetSpeed = () => handleSetSpeed(PLAYBACK_SPEEDS.NORMAL)

const handlePlay = async () => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: playing.value ? "pause" : "play" }); // fix

    playing.value = response;
  }
};

const handleSkip = async (time: SKIP_INTERVALS) => {
  const tabId = await getTabId();

  if (tabId) {
    await sendMessageToTab(tabId, { action: "seek", time });
  }
};

const handleMute = async () => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: muted.value ? "unmute" : "mute" });
    muted.value = response;
  }
};

const handleSetSpeed = async (speed: PLAYBACK_SPEEDS) => {
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
    :playing="playing"
    :playbackRate="playbackRate"
    :muted="muted"
    :canIncreasePlaybackSpeed="!isCurrentSpeedAtMaximum"
    :canDecreasePlaybackSpeed="!isCurrentSpeedAtMinimum"
    @play="handlePlay"
    @skip="handleSkip"
    @increaseSpeed="handleIncreaseSpeed"
    @reduceSpeed="handleDecreaseSpeed"
    @resetSpeed="handleResetSpeed"
    @mute="handleMute"
    @openTest="handleOpenFullPage"
  />
</template>
