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
    border: 1px solid light-dark(var(--light-highlight-color), var(--dark-highlight-color));
    background-color: light-dark(white, black);
    border-radius: 0.5rem;
    color: light-dark(black, white);
    font-weight: lighter;
    font-size: 0.8rem;
    left: 50%;
    opacity: 0;
    padding: 0.5rem;
    position: absolute;
    top: 2rem;
    transform: translateX(-50%);
    transition: opacity 0.2s ease-in-out;
    white-space: nowrap;
    z-index: 100;
  }

  .label-container:hover .label-tooltip {
    opacity: 1;
  }
</style>
