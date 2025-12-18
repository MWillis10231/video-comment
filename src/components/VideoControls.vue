
<script setup lang="ts">
defineProps<{
  playbackRate: number;
}>();
</script>

<template>
  <div class="video-controls">
    <button @click="$emit('skip', -5)">⏪🇯</button>
    <button @click="$emit('play')">⏯️🇰</button>
    <button @click="$emit('skip', 5)">⏩🇱</button>
    <button @click="$emit('setSpeed', .25)">⚡️🇴</button>
    <button @click="$emit('setSpeed', -.25)">🐢🇮</button>
    <button disabled>🔇</button>
    <button @click="$emit('openTest')">OPEN TEST</button>
  </div>
</template>

<style scoped>
  .video-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 2rem;
  }
</style>
