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
    <div class="buttons" v-if="!hideButtons">
      <button @click="$emit(`edit`, comment.id)">✏️</button>
      <button @click="$emit(`delete`, comment.id)">{{ comment.deleted ? '♻️' : '❌' }}</button>
    </div>

    <Comment :comment="comment" />
  </li>
</template>

<style scoped>
  .commentContainer {
    align-items: center;
    display: flex;
    height: 23px;
    gap: 0.5rem;
  }

  .buttons {
    display: flex;
    gap: 0.2rem;
  }
</style>
