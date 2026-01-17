<script setup lang="ts">
import CustomLabel from './CustomLabel.vue';

defineProps<{
  name: string;
}>();
</script>

<template>
  <CustomLabel :name="`video-control-button-${name}`">
    <button class="button">
      <slot />

      <span class="shortcut">
        <slot name="shortcut" />
      </span>
    </button>

    <template #tooltip>
      <slot name="label" />
    </template>
  </CustomLabel>
</template>

<style scoped>
  .button {
    align-items: center;
    background-color: transparent;
    border-radius: 5px;
    border: 1px solid gray;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    fill: white;
    font-size: 1rem;
    position: relative;

    &:active {
      background-color: gray;
    }

    &:hover {
      border-color: white;
    }

    &:hover .shortcut {
      color: white;
    }
  }

  .shortcut {
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: gray;
    pointer-events: none;
  }
</style>
