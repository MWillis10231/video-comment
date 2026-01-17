<script setup lang="ts">
  import ChangelogEntry from './ChangelogEntry.vue';
</script>

<template>
  <div class="container">
    <h2>About</h2>

    <p>Current version: 2.0.0</p>

    <article>
      <h3>What is this?</h3>
      <p>
        This is a simple Vue 3 app that allows you to create and manage comments for a video.
      </p>
    </article>

    <article>
      <h3>Changelog</h3>

      <ChangelogEntry>
        <template #version>## 2.0.0</template>

        <template #major>
          <li>Enabled multiple events for single comment</li>
          <li>Added shortlist for awards option</li>
          <li>Submitting a comment is no longer possible without an event</li>
        </template>

        <template #minor>
          <li>Redesigned icons</li>
          <li>Added video control options - including video speed and mute</li>
          <li>Added shortcuts for all major comment actions</li>
          <li>Added settings to open last opened page on startup</li>
          <li>Added setting for default padding of start timestamp</li>
          <li>Added lots of new tooltips</li>
        </template>

        <template #bug>
          <li>Fixed all icons being filtered from comment parsing</li>
          <li>Fixed many visual bugs</li>
        </template>
      </ChangelogEntry>

      <ChangelogEntry>
        <template #version>## 1.3.0</template>

        <template #minor>
          <li>Added quick buttons for video times (+- seconds) and deleting timestamps</li>
          <li>Added option to import video comments from a video</li>
          <li>Deletion of single comments is temporary until clean button used</li>
          <li>Added option to restore deleted comments</li>
          <li>Deleted comments are not copied to the clipboard, nor visible in publish mode</li>
        </template>

        <template #bug>
          <li>Fixed comments not ordering by time - they now re-arrange themselves by start timestamp, then end timestamp</li>
          <li>Improved visual consistency between different comment types</li>
        </template>
      </ChangelogEntry>

      <ChangelogEntry>
        <template #version>## 1.2.0</template>

        <template #minor>
          <li>Add support for light and dark modes</li>
          <li>Add settings menu to customise font and highlight color</li>
        </template>
      </ChangelogEntry>

      <ChangelogEntry>
        <template #version>## 1.1.0</template>

        <template #minor>
          <li>Add 'control' event type</li>
          <li>Add copy to clipboard button</li>
          <li>Add focus to explanation field when buttons are clicked</li>
        </template>

        <template #bug>
          <li>Fix flickering of buttons when publish mode is enabled / disabled</li>
          <li>Fix publish mode copying extra line breaks</li>
          <li>Fix active button not being visually apparent</li>
        </template>
      </ChangelogEntry>

      <ChangelogEntry>
        <template #version>## 1.0.0</template>

        <template #major>
          <li>Initial release</li>
        </template>
      </ChangelogEntry>
    </article>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
