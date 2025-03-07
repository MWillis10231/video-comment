<script setup lang="ts">
import { ref } from 'vue';
import CommentPage from './components/CommentPage.vue';
import { PAGE } from './enum';
import AboutPage from './components/AboutPage.vue';

const page = ref(PAGE.COMMENTS);
</script>

<template>
  <header>
    <h1>Comments v1.1.0</h1>
  </header>

  <nav>
    <button
      :class="['button', { active: page === PAGE.COMMENTS }]"
      :disabled="page === PAGE.COMMENTS"
      @click="page = PAGE.COMMENTS"
    >
      Comments 💬
    </button>

    <button
      :class="['button', { active: page === PAGE.SETTINGS }]"
      :disabled="page === PAGE.SETTINGS"
      @click="page = PAGE.SETTINGS"
    >
      Settings ⚙️
    </button>

    <button
      :class="['button', { active: page === PAGE.ABOUT }]"
      :disabled="page === PAGE.ABOUT"
      @click="page = PAGE.ABOUT"
    >
      About ℹ️
    </button>
  </nav>

  <main>
    <CommentPage 
      v-if="page === PAGE.COMMENTS"
    />

    <div v-if="page === PAGE.SETTINGS">
      <h2>Settings</h2>

      Coming soon
    </div>

    <AboutPage v-if="page === PAGE.ABOUT" />
  </main>
</template>

<style scoped>
  main {
    padding: 1rem;
    width: 100%;
  }

  nav {
    display: flex;
    gap: .5rem;
  }

  .button {
    &.active {
      background-color: lightblue;
    }
  }
</style>
