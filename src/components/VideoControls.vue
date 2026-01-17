
<script setup lang="ts">
import type { PLAYBACK_SPEEDS } from '@/enum';
import ForwardFiveIcon from './Icons/ForwardFiveIcon.vue';
import PauseIcon from './Icons/PauseIcon.vue';
import PlayIcon from './Icons/PlayIcon.vue';
import ReplayFiveIcon from './Icons/ReplayFiveIcon.vue';
import SpeedDecreaseIcon from './Icons/SpeedDecreaseIcon.vue';
import SpeedIncreaseIcon from './Icons/SpeedIncreaseIcon.vue';
import SpeedResetIcon from './Icons/SpeedResetIcon.vue';
import VideoControlButton from './VideoControlButton.vue';
import SpeedQuarterIcon from './Icons/SpeedQuarterIcon.vue';
import SpeedHalfIcon from './Icons/SpeedHalfIcon.vue';
import SpeedThreeQuartersIcon from './Icons/SpeedThreeQuartersIcon.vue';
import SpeedOneIcon from './Icons/SpeedOneIcon.vue';
import SpeedOneAndQuarterIcon from './Icons/SpeedOneAndQuarterIcon.vue';
import SpeedOneAndHalfIcon from './Icons/SpeedOneAndHalfIcon.vue';
import SpeedOneAndThreeQuartersIcon from './Icons/SpeedOneAndThreeQuartersIcon.vue';
import SpeedDoubleIcon from './Icons/SpeedDoubleIcon.vue';
import type { Component } from 'vue';
import ReplayTenIcon from './Icons/ReplayTenIcon.vue';
import ReplayThirtyIcon from './Icons/ReplayThirtyIcon.vue';
import ForwardTenIcon from './Icons/ForwardTenIcon.vue';

defineProps<{
  playbackRate: PLAYBACK_SPEEDS;
  playing: boolean;
}>();

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'skip', seconds: number): void;
  (e: 'setSpeed', delta: number): void;
  (e: 'openTest'): void;
}>();

const PLAYBACK_SPEEDS_TO_ICON_COMPONENT_MAP: Record<PLAYBACK_SPEEDS, Component> = {
  0.25: SpeedQuarterIcon,
  0.5: SpeedHalfIcon,
  0.75: SpeedThreeQuartersIcon,
  1: SpeedOneIcon,
  1.25: SpeedOneAndQuarterIcon,
  1.5: SpeedOneAndHalfIcon,
  1.75: SpeedOneAndThreeQuartersIcon,
  2: SpeedDoubleIcon,
};

addEventListener('keydown', (event) => { // these should call methods that are also emits used below by buttons
  if (event.altKey) {
    switch (event.key.toLowerCase()) {
      case 'j':
        event.preventDefault();
        emit('skip', -5);
        break;
      case 'k':
        event.preventDefault();
        emit('play');
        break;
      case 'l':
        event.preventDefault();
        emit('skip', 5);
        break;
      case 'o':
        event.preventDefault();
        emit('setSpeed', 0.25);
        break;
      case 'i':
        event.preventDefault();
        emit('setSpeed', -0.25);
        break;
      case 'p':
        event.preventDefault();
        emit('setSpeed', 0); // reset speed to normal
        break;
    }
  }
});
</script>

<template>
  <div class="video-controls">
    <VideoControlButton @click="$emit('skip', -10)">
      <ReplayTenIcon class="icon" />

      <template #label>
        alt+h
      </template>
    </VideoControlButton>

    <VideoControlButton @click="$emit('skip', -5)">
      <ReplayFiveIcon class="icon" />

      <template #label>
        alt+j
      </template>
    </VideoControlButton>

    <VideoControlButton @click="$emit('play')">
      <PauseIcon class="icon" v-if="playing" />
      <PlayIcon class="icon" v-else />

      <template #label>
        alt+k
      </template>
    </VideoControlButton>

    <VideoControlButton @click="$emit('skip', 5)">
      <ForwardFiveIcon class="icon" />

      <template #label>
        alt+l
      </template>
    </VideoControlButton>

    <VideoControlButton @click="$emit('skip', 10)">
      <ForwardTenIcon class="icon" />

      <template #label>
        alt+;
      </template>
    </VideoControlButton>

    <div class="divider" />

    <VideoControlButton @click="$emit('setSpeed', -.25)">
      <SpeedDecreaseIcon class="icon" />

      <template #label>
        alt+i
      </template>
    </VideoControlButton>

    <div class="dial">
      <component
        :is="PLAYBACK_SPEEDS_TO_ICON_COMPONENT_MAP[playbackRate]"
        class="icon"
      />
    </div>

    <VideoControlButton @click="$emit('setSpeed', .25)">
      <SpeedIncreaseIcon class="icon" />

      <template #label>
        alt+o
      </template>
    </VideoControlButton>

    <VideoControlButton @click="$emit('setSpeed', 0)">
      <SpeedResetIcon class="icon" />

      <template #label>
        alt+p
      </template>
    </VideoControlButton>

    <div class="divider" />

    <VideoControlButton disabled>🔇</VideoControlButton>
    <VideoControlButton @click="$emit('openTest')">OPEN TEST</VideoControlButton>
  </div>
</template>

<style scoped>
  .video-controls {
    display: flex;
    justify-content: center;
    gap: .5rem;
  }

  .divider {
    border-left: 1px solid gray;
    margin: 0 .5rem;
  }

  .dial {
    align-items: center;
    background-color: transparent;
    border-radius: 5px;
    border: 1px solid gray;
    display: inline-flex;
    justify-content: center;
    fill: white;
    font-size: 1rem;
    width: 3rem;
  }

  .icon {
    fill: white;
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
