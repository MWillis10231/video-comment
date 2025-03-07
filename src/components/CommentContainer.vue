<script setup lang="ts">
import type { CommentType } from '../types';
import Comment from './Comment.vue';

defineEmits(['edit', 'delete']);

defineProps<{
  comment: CommentType;
  hideButtons?: boolean;
}>();

</script>

<template>
  <li class="commentContainer">
    <Comment :comment="comment" />

    <div class="buttons" v-if="!hideButtons">
      <button @click="$emit(`edit`, comment.id)">✏️</button>
      <button @click="$emit(`delete`, comment.id)">❌</button>
    </div>
  </li>
</template>

<style scoped>
  .commentContainer {
    display: flex;
    height: 23px;
    gap: 0.5rem;
    justify-content: space-between;
  }

  .text {
    white-space: nowrap;
  }

  .buttons {
    display: flex;
    gap: 0.2rem;
  }
</style>