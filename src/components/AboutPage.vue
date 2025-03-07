<script setup lang="ts">
</script>

<template>
  <div class="container">
    <h2>About</h2>

    <p>Current version: 1.1.0</p>

    <article>
      <h3>What is this?</h3>
      <p>
        This is a simple Vue 3 app that allows you to create and manage comments for a video.
      </p>
    </article>

    <article>
      <h3>Changelog</h3>
      <h4>## 1.1.0</h4>
      <h5>Features</h5>

      <ul>
        <li>Add 'control' event type</li>
        <li>Add copy to clipboard button</li>
        <li>Add focus to explanation field when buttons are clicked</li>
      </ul>

      <h5>Bug Fixes</h5>

      <ul>
        <li>Fix flickering of buttons when publish mode is enabled / disabled</li>
        <li>Fix publish mode copying extra line breaks</li>
        <li>Fix active button not being visually apparent</li>
      </ul>

      <h4>## 1.0.0</h4>
      <h5>Initial release</h5>
    </article>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
</style>