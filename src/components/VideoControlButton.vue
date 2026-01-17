<template>
  <button
    class="button"
    @click="$emit('click')"
  >
    <slot />

    <span class="label">
      <slot name="label" />
    </span>
  </button>
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
  }

  .label {
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: gray;
    pointer-events: none;
  }
</style>
