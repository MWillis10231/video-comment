<script setup lang="ts">
import { EVENT_TYPE_TO_DESCRIPTION_MAP } from '@/constants';
import type { CommentType } from '../types';

defineProps<{
  comment: CommentType;
}>();

</script>

<template>
  <span :class="[`text`, comment.deleted ? `deleted` : ``]">
    {{ comment.startTimestamp }} {{ comment.endTimestamp ? `- ${comment.endTimestamp}` : `` }} - [<span v-for="(eventType, index) in comment.eventTypes" :key="eventType">{{ EVENT_TYPE_TO_DESCRIPTION_MAP[eventType] }}{{ index + 1 === comment.eventTypes.length ? '' : ',' }}</span>] - {{ comment.includeOnHighlights ? `⭐` : `` }}{{ comment.includeOnAwardShortlist ? `🏆` : `` }} {{ comment.explanation }}
  </span>
</template>

<style scoped>
  .text {
    &.deleted {
      text-decoration: line-through;
    }
  }
</style>
