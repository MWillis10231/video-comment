<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import CommentContainer from './CommentContainer.vue';
import NewCommentContainer from './NewCommentContainer.vue';
import EditCommentContainer from './EditCommentContainer.vue';
import type { CommentType } from '@/types';
import { clearStoredCommentsFromLocalStorage, parseComments, retrieveStoredCommentsFromLocalStorage, sortComments, storeCommentsInLocalStorage } from '@/commentService';
import CustomLabel from './CustomLabel.vue';
import VideoControlsContainer from './VideoControlsContainer.vue';
import { getTabId, sendMessageToTab } from '@/chromeTabsService';

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
  comments.value = retrieveStoredCommentsFromLocalStorage();
}

const readCommentsFromPage = async () => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: "getComments" });

    if (response) {
      comments.value = sortComments(parseComments(response));
      storeComments();
    }
  }
};

const storeComments = () => storeCommentsInLocalStorage(comments.value);

const removeComments = () => {
  if (window.confirm(`Remove all comments?`)) {
    clearStoredCommentsFromLocalStorage();
    comments.value = [];
  }
}

const copyCommentsToClipboard = async () => {
  // TODO: the publish mode causes a flicker when turned on and off => just show a loader?

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


const commentsToPublish = computed(() => {
  return comments.value.filter((comment) => !comment.deleted);
});

const commentsToShow = computed(() => {
  return publishMode.value ? commentsToPublish.value : comments.value;
});

getStoredComments();
</script>

<template>
  <article class="container">
    <aside class="controls">
      <VideoControlsContainer />
    </aside>

    <section class="editCommentSection">
      <EditCommentContainer
        v-if="editMode && editComment"
        :comment="editComment"
        @save="handleSaveEditedComment"
        @discard="leaveEditMode"
      />
        <NewCommentContainer v-else @add="handleAddComment" />
    </section>

    <section class="allCommentsSection">
      <h2 class="commentsHeader">
        All Comments

        <CustomLabel name="copy-comments">
          <button @click="copyCommentsToClipboard">
              📋
          </button>

          <template #tooltip>Copy comments to clipboard</template>
        </CustomLabel>

        <CustomLabel name="toggle-publish-mode">
          <button @click="publishMode = !publishMode">
            {{ publishMode ? `✏️` : `💎` }}
          </button>
          <template #tooltip>Toggle {{ publishMode ? `edit` : `publish` }} mode</template>
        </CustomLabel>

        <CustomLabel
          v-if="!publishMode"
          name="clean-comments-marked-for-deletion"
        >
          <button

            @click="handleCleanComments"
            :disabled="comments.length === 0"
          >
            🧽
          </button>

          <template #tooltip>Remove all comments marked for deletion</template>
        </CustomLabel>

        <CustomLabel name="remove-all-comments">
          <button
            :disabled="comments.length === 0"
            @click="removeComments"
          >
            🗑️
          </button>

          <template #tooltip>Remove all comments</template>
        </CustomLabel>
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
  </article>
</template>

<style scoped>
  .container {
    display: grid;
    grid-template-areas:
      "header header"
      "add all";
    grid-template-columns: 250px 5fr;
    gap: 1rem;
    width: 100%;
  }

  .controls {
    grid-area: header;
  }

  .editCommentSection {
    grid-area: add;
  }

  .allCommentsSection {
    grid-area: all;
  }

  .section {
    width: 100%;
  }

  .commentsHeader {
    gap: .5rem;
    white-space: nowrap;
    width: fit-content
  }
</style>
