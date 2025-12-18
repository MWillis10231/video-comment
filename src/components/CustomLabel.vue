<script setup lang="ts">
  const { name } = defineProps({
    name: {
      type: String,
      required: true,
    },
  })

  const tooltipString = `${name}-tooltip`;
</script>

<template>
  <div
    :aria-labelledby="`${name} ${tooltipString}`"
    class="label-container"
  >
    <div class="label-content" :id="name">
      <slot />
    </div>

    <span role="tooltip" class="label-tooltip" :id="tooltipString" >
      <slot name="tooltip" />
    </span>
  </div>
</template>

<style scoped>
  .label-container {
    position: relative;
  }

  .label-tooltip {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--dark-highlight-color);
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .label-container:hover .label-tooltip {
    opacity: 1;
  }
</style>
