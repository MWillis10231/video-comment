
<script setup lang="ts">
import { PLAYBACK_SPEEDS, SKIP_INTERVALS } from '@/enum';
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
import ForwardTenIcon from './Icons/ForwardTenIcon.vue';
import VolumeIcon from './Icons/VolumeIcon.vue';
import VolumeOffIcon from './Icons/VolumeOffIcon.vue';
import CustomLabel from './CustomLabel.vue';

defineProps<{
  playbackRate: PLAYBACK_SPEEDS;
  playing: boolean;
  muted: boolean;
  canIncreasePlaybackSpeed: boolean;
  canDecreasePlaybackSpeed: boolean;
}>();

const emit = defineEmits<{
  (e: 'play'): void;
  (e: 'skip', seconds: number): void;
  (e: 'increaseSpeed'): void;
  (e: 'reduceSpeed'): void,
  (e: 'resetSpeed'): void,
  (e: 'openTest'): void;
  (e: 'mute'): void;
}>();

const showTest = false;

const PLAYBACK_SPEEDS_TO_ICON_COMPONENT_MAP: Record<PLAYBACK_SPEEDS, Component> = {
  [PLAYBACK_SPEEDS.QUARTER]: SpeedQuarterIcon,
  [PLAYBACK_SPEEDS.HALF]: SpeedHalfIcon,
  [PLAYBACK_SPEEDS.THREE_QUARTERS]: SpeedThreeQuartersIcon,
  [PLAYBACK_SPEEDS.NORMAL]: SpeedOneIcon,
  [PLAYBACK_SPEEDS.ONE_AND_QUARTER]: SpeedOneAndQuarterIcon,
  [PLAYBACK_SPEEDS.ONE_AND_HALF]: SpeedOneAndHalfIcon,
  [PLAYBACK_SPEEDS.ONE_AND_THREE_QUARTERS]: SpeedOneAndThreeQuartersIcon,
  [PLAYBACK_SPEEDS.DOUBLE]: SpeedDoubleIcon,
};

const handleSkip = (interval: SKIP_INTERVALS) => emit('skip', interval)
const handleMute = () => emit('mute');

addEventListener('keydown', (event) => { // these should call methods that are also emits used below by buttons
  if (event.altKey) {
    switch (event.key.toLowerCase()) {
      case 'h':
        event.preventDefault();
        handleSkip(SKIP_INTERVALS.NEGATIVE_TEN)
        break;
      case 'j':
        event.preventDefault();
        handleSkip(SKIP_INTERVALS.NEGATIVE_FIVE)
        break;
      case 'k':
        event.preventDefault();
        emit('play');
        break;
      case 'l':
        event.preventDefault();
        handleSkip(SKIP_INTERVALS.FIVE)
        break;
      case ';':
        event.preventDefault();
        handleSkip(SKIP_INTERVALS.TEN)
        break;
      case 'o':
        event.preventDefault();
        emit('increaseSpeed');
        break;
      case 'i':
        event.preventDefault();
        emit('reduceSpeed');
        break;
      case 'p':
        event.preventDefault();
        emit('resetSpeed');
        break;
      case 'm':
        event.preventDefault();
        handleMute();
        break;
    }
  }
});
</script>

<template>
  <div class="video-controls">
    <VideoControlButton name="back-10" @click="handleSkip(SKIP_INTERVALS.NEGATIVE_TEN)">
      <ReplayTenIcon class="icon" />

      <template #shortcut>
          alt+h
      </template>

      <template #label>
          -10s
      </template>
    </VideoControlButton>

    <VideoControlButton name="back-5" @click="handleSkip(SKIP_INTERVALS.NEGATIVE_FIVE)">
      <ReplayFiveIcon class="icon" />

      <template #shortcut>
        alt+j
      </template>

      <template #label>
          -5s
      </template>
    </VideoControlButton>

    <VideoControlButton name="play-pause" @click="$emit('play')">
      <PauseIcon class="icon" v-if="playing" />
      <PlayIcon class="icon" v-else />

      <template #shortcut>
        alt+k
      </template>

      <template #label>
        {{ playing ? `Pause` : `Play` }}
      </template>
    </VideoControlButton>

    <VideoControlButton name="forward-5" @click="handleSkip(SKIP_INTERVALS.FIVE)">
      <ForwardFiveIcon class="icon" />

      <template #shortcut>
        alt+l
      </template>

      <template #label>
          +5s
      </template>
    </VideoControlButton>

    <VideoControlButton name="forward-10" @click="handleSkip(SKIP_INTERVALS.TEN)">
      <ForwardTenIcon class="icon" />

      <template #shortcut>
        alt+;
      </template>

      <template #label>
          +10s
      </template>
    </VideoControlButton>

    <div class="divider" />

    <VideoControlButton name="speed-decrease" @click="$emit('reduceSpeed')">
      <SpeedDecreaseIcon class="icon" />

      <template #shortcut>
        alt+i
      </template>

      <template #label>
        Decrease speed
      </template>
    </VideoControlButton>

    <div class="dial">
        <CustomLabel name="dial-playback-speed">
          <component
            :is="PLAYBACK_SPEEDS_TO_ICON_COMPONENT_MAP[playbackRate]"
            class="icon"
          />

          <template #tooltip>
            Current playback speed
          </template>
        </CustomLabel>
    </div>

    <VideoControlButton name="speed-increase" @click="$emit('increaseSpeed')">
      <SpeedIncreaseIcon class="icon" />

      <template #shortcut>
        alt+o
      </template>

      <template #label>
        Increase speed
      </template>
    </VideoControlButton>

    <VideoControlButton name="speed-reset" @click="$emit('resetSpeed')">
      <SpeedResetIcon class="icon" />

      <template #shortcut>
        alt+p
      </template>

      <template #label>
        Reset speed
      </template>
    </VideoControlButton>

    <div class="divider" />

    <VideoControlButton name="mute" @click="handleMute">
      <VolumeOffIcon
        v-if="muted"
        class="icon"
      />

      <VolumeIcon
        v-else
        class="icon"
      />

      <template #shortcut>
        alt+m
      </template>

      <template #label>
        {{ muted ? `Unmute` : `Mute` }}
      </template>
    </VideoControlButton>

    <VideoControlButton name="test" v-if="showTest" @click="$emit('openTest')">T</VideoControlButton>
  </div>
</template>

<style scoped>
  .video-controls {
    display: flex;
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
    height: 1.5rem;
    width: 1.5rem;
  }
</style>
