<script setup lang="ts">
import { nextTick, ref, useTemplateRef, type Ref } from 'vue';
import CommentContainer from './CommentContainer.vue';
import NewCommentContainer from './NewCommentContainer.vue';
import EditCommentContainer from './EditCommentContainer.vue';
import type { CommentType } from '@/types';

const comments = ref([]) as Ref<CommentType[]>;
const editMode = ref(false);
const publishMode = ref(false);
const editComment = ref(null) as Ref<CommentType | null>;

const commentsListRef = useTemplateRef('commentsList');

const handleAddComment = (comment: CommentType) => {
  comments.value.push(comment);
  storeComments()
};

const handleEditComment = (id: string) => {
  const commentToEdit = comments.value.find((comment) => comment.id === id);

  if (commentToEdit !== undefined) {
    editMode.value = true;
    editComment.value = commentToEdit;
  }
};

const leaveEditMode = () => {
  editMode.value = false;
  editComment.value = null;
};

const handleSaveEditedComment = (newComment: CommentType) => {
  const index = comments.value.findIndex((comment) => comment.id === newComment.id);
  comments.value[index] = newComment;

  storeComments();
  leaveEditMode();
};

const handleRemoveComment = (id: string) => {
  comments.value = comments.value.filter((comment) => comment.id !== id);
  storeComments();
};

const getStoredComments = () => {
  const storedComments = localStorage.getItem('comments');

  if (storedComments) {
    comments.value = JSON.parse(storedComments);
  }
}

const storeComments = () => localStorage.setItem('comments', JSON.stringify(comments.value));

const removeComments = () => {
  if (window.confirm(`Remove all comments?`)) {
    localStorage.removeItem('comments');
    comments.value = [];
  }
}

const copyCommentsToClipboard = async () => {
  if (commentsListRef.value) {
    const isPublishMode = publishMode.value;

    if (!isPublishMode) {
      publishMode.value = true;
    }

    await nextTick();

    const commentsList = commentsListRef.value as HTMLElement;

    await navigator.clipboard.writeText(commentsList.innerText);

    if (!isPublishMode) {
      publishMode.value = false;
    }
  }}

getStoredComments();
</script>

<template>
  <div class="container">
    <section>
      <EditCommentContainer
        v-if="editMode && editComment"
        :comment="editComment"
        @save="handleSaveEditedComment" 
        @discard="leaveEditMode"
      />
        <NewCommentContainer v-else @add="handleAddComment" />
    </section>

    <section>
      <h2>
        All Comments

        <button 
          @click="copyCommentsToClipboard"
        >
          📋
        </button>

        <button 
          @click="publishMode = !publishMode"
        >
          {{ publishMode ? `✏️` : `💎` }}
        </button>

        <button
          :disabled="comments.length === 0"
          @click="removeComments"
        >
          🗑️
        </button>

        <button
          @click=""  
        >
          ⬆️
        </button>
      </h2>

      <ul ref="commentsList">
        <CommentContainer 
          v-for="(comment, index) in comments" 
          :key="index" 
          :comment="comment"
          :hideButtons="editMode || publishMode"
          @edit="handleEditComment"
          @delete="handleRemoveComment"
        />
      </ul>
    </section>
  </div>
</template>

<style scoped>
  .container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
  }

  .section {
    width: 100%;
  }
</style>
