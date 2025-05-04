<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import CommentContainer from './CommentContainer.vue';
import NewCommentContainer from './NewCommentContainer.vue';
import EditCommentContainer from './EditCommentContainer.vue';
import type { CommentType } from '@/types';
import { compareTimeStamps } from '@/timestampService';
import { parseComments } from '@/commentService';

const comments = ref([]) as Ref<CommentType[]>;
const editMode = ref(false);
const publishMode = ref(false);
const editComment = ref(null) as Ref<CommentType | null>;

const commentsListRef = useTemplateRef('commentsList');

const handleAddComment = (comment: CommentType) => {
  comments.value.push(comment);
  comments.value = sortComments(comments.value);
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

const handleDeleteComment = (id: string) => {
  const index = comments.value.findIndex((comment) => comment.id === id);

  comments.value[index] = {
    ...comments.value[index],
    deleted: !comments.value[index].deleted,
  };
  storeComments();
};

const handleCleanComments = () => {
  if (window.confirm(`Remove all comments marked for deletion?`)) {
    comments.value = comments.value.filter((comment) => !comment.deleted);
    storeComments();
  }
};

const getStoredComments = () => {
  const storedComments = localStorage.getItem('comments');

  if (storedComments) {
    comments.value = sortComments(JSON.parse(storedComments));
  }
}

const readCommentsFromPage = async () => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, { action: 'getComments' });

  if (response) {
    comments.value = sortComments(parseComments(response));
    storeComments();
  }
};

const sortComments = (comments) => {
  return comments.sort((a, b) => {
    const result = compareTimeStamps(a.startTimestamp, b.startTimestamp);
    const areTimestampsEqual = result === 0;

    return areTimestampsEqual
      ? compareTimeStamps(a.endTimestamp, b.endTimestamp)
      : result;
  });
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

const commentsToShow = computed(() => {
  if (publishMode.value) {
    return comments.value.filter((comment) => !comment.deleted);
  }

  return comments.value;
});

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
      <h2 class="commentsHeader">
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
          v-if="!publishMode"
          @click="handleCleanComments"
          :disabled="comments.length === 0"
        >
          🧽
        </button>

        <button
          :disabled="comments.length === 0"
          @click="removeComments"
        >
          🗑️
        </button>

        <button
          @click="readCommentsFromPage"
        >
          ⬆️
        </button>
      </h2>

      <ul ref="commentsList">
        <CommentContainer
          v-for="(comment, index) in commentsToShow"
          :key="index"
          :comment="comment"
          :hideButtons="editMode || publishMode"
          @edit="handleEditComment"
          @delete="handleDeleteComment"
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

  .commentsHeader {
    gap: .5rem;
    width: fit-content
  }
</style>
