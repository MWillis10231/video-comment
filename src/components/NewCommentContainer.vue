<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import CommentForm from './CommentForm.vue';
import { EVENT_TYPE } from '@/enum';
import type { CommentType } from '@/types';

const emit = defineEmits(['add']);

const getNewComment = () => ({
  startTimestamp: '',
  endTimestamp: '',
  eventType: EVENT_TYPE.OTHER,
  includeOnHighlights: false,
  explanation: '',
  id: uuidv4(),
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
  <CommentForm 
    :comment="comment"
    @add="addComment"
    @edit="editComment"
   />
</template>
