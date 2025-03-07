<script setup lang="ts">
import { EVENT_TYPE_TO_DESCRIPTION_MAP } from '@/constants';
import type { CommentType } from '../types';

defineProps<{
  comment: CommentType;
}>();
</script>

<template>
  <span class="text">
    {{ comment.startTimestamp }} - {{ comment.endTimestamp }} [{{ EVENT_TYPE_TO_DESCRIPTION_MAP[comment.eventType] }}] {{ comment.includeOnHighlights ? `⭐` : `` }}{{ comment.explanation ? `- ${comment.explanation}` : `` }}
  </span>
</template>

<style scoped>
  .text {
    white-space: nowrap;
  }
</style>