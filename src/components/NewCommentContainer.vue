<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import CommentFormContainer from './CommentFormContainer.vue';
import { EVENT_TYPE } from '@/enum';
import type { CommentType } from '@/types';

const emit = defineEmits(['add']);

const getNewComment = () => ({
  startTimestamp: '00:00:00',
  endTimestamp: null,
  eventTypes: [EVENT_TYPE.OTHER],
  includeOnHighlights: false,
  explanation: '',
  id: uuidv4(),
  includeOnAwardShortlist: false,
})

const comment = ref(getNewComment()) as Ref<CommentType>;

const addComment = () => {
  emit('add', comment.value);
  comment.value = getNewComment();
};

const editComment = (newComment: CommentType) => {
  comment.value = newComment;
};
</script>

<template>
  <CommentFormContainer
    :comment="comment"
    @add="addComment"
    @edit="editComment"
   />
</template>
