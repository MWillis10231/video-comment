<script setup lang="ts">
import { ref, type Ref } from 'vue';
import CommentFormContainer from './CommentFormContainer.vue';
import type { CommentType } from '@/types';

const emit = defineEmits(['save', 'discard']);

const props = defineProps<{
  comment: CommentType
}>();

const comment = ref(props.comment) as Ref<CommentType>;

const saveComment = () => {
  emit('save', comment.value);
};

const editComment = (newComment: CommentType) => {
  comment.value = newComment;
};

</script>

<template>
  <CommentFormContainer
    editMode
    :comment="comment"
    @add="saveComment"
    @edit="editComment"
    @discard="$emit('discard')"
   />
</template>
