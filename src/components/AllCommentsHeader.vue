<script setup lang="ts">
import CustomLabel from './CustomLabel.vue';
import CleaningBucketIcon from './Icons/CleaningBucketIcon.vue';
import CopyAllIcon from './Icons/CopyAllIcon.vue';
import DeleteForeverIcon from './Icons/DeleteForeverIcon.vue';
import DiamondIcon from './Icons/DiamondIcon.vue';
import EditIcon from './Icons/EditIcon.vue';

defineEmits(['togglePublishMode', 'cleanComments', 'removeComments', 'copyCommentsToClipboard']);

defineProps<{
  publishMode: boolean;
  hasComments: boolean;
}>();
</script>

<template>
  <h2 class="commentsHeader">
    All Comments

    <CustomLabel name="copy-comments">
      <button @click="$emit('copyCommentsToClipboard')">
          <CopyAllIcon class="icon" />
      </button>

      <template #tooltip>Copy comments to clipboard</template>
    </CustomLabel>

    <CustomLabel name="toggle-publish-mode">
      <button @click="$emit('togglePublishMode')">
        <EditIcon v-if="publishMode" class="icon" />

        <DiamondIcon v-else class="icon" />
      </button>
      <template #tooltip>Toggle {{ publishMode ? `edit` : `publish` }} mode</template>
    </CustomLabel>

    <CustomLabel
      v-if="!publishMode"
      name="clean-comments-marked-for-deletion"
    >
      <button
        :disabled="hasComments"
        @click="$emit('cleanComments')"
      >
        <CleaningBucketIcon class="icon" />
      </button>

      <template #tooltip>Remove all comments marked for deletion</template>
    </CustomLabel>

    <CustomLabel name="remove-all-comments">
      <button
        :disabled="hasComments"
        @click="$emit('removeComments')"
      >
        <DeleteForeverIcon class="icon" />
      </button>

      <template #tooltip>Remove all comments</template>
    </CustomLabel>
  </h2>
</template>

<style scoped>
  .commentsHeader {
    gap: .5rem;
    white-space: nowrap;
    width: fit-content
  }
</style>
