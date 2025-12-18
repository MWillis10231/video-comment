<script setup lang="ts">
import type { CommentType } from '@/types';
import { ref, useTemplateRef } from 'vue';
import { convertTimeStampToDate, convertDateToTimeStamp, isTimeStampTruthy, isFirstTimeStampOlder, parseTimeStamp } from '@/timestampService';
import { addSeconds } from "date-fns";
import { getTabId, sendMessageToTab } from '@/chromeTabsService';
import CommentForm from './CommentForm.vue';
import { EVENT_TYPE } from '@/enum';

const emit = defineEmits(['add', 'edit', 'discard']);

const props = defineProps<{
  comment: CommentType;
  editMode?: boolean;
}>();

const videoDuration = ref(null)

const getAndSetTime = async ({ field }) => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: "getTime" });

    if (response) {
      handleEditTime({ field, value: parseTimeStamp(response) });
    }
  }
}

const commentRef = useTemplateRef('comment');

const handleEdit = ({ field, value }) => {
  let commentToEmit = {
    ...props.comment,
    [field]: value
  }

  if (field === 'eventType' && value === EVENT_TYPE.GOAL) {
    commentToEmit = {
      ...commentToEmit,
      includeOnHighlights: true,
    }
  }

  emit('edit', commentToEmit);

  if (commentRef.value) {
    commentRef.value.focus();
  }
}

const handleAddTime = ({ field, value }) => {
  let currentValue = props.comment[field];

  if (!currentValue && field === 'endTimestamp') {
    currentValue = props.comment.startTimestamp;
  }

  const currentTime = convertTimeStampToDate(currentValue);
  const newTime = addSeconds(currentTime, value);
  const newTimeStamp = convertDateToTimeStamp(newTime);

  handleEditTime({ field, value: newTimeStamp });
}

const handleEditTime = async ({ field, value }) => {
  if (field === 'endTimestamp') {
    const isValueNullOrLaterThanStart = !value || isFirstTimeStampOlder(props.comment.startTimestamp, value);

    if (isValueNullOrLaterThanStart) {
      handleEdit({ field, value });
    }
  } else if (videoDuration.value && isFirstTimeStampOlder(value, videoDuration.value)) {
    handleEdit({ field, value });
  }
}

const getVideoDuration = async () => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: "getDuration" });

    if (response) {
      videoDuration.value = response;
    }
  }
}

getVideoDuration();
</script>

<template>
  <CommentForm
    :comment="comment"
    @edit="handleEdit"
    @editTime="handleEditTime"
    @addTime="handleAddTime"
    @getAndSetTime="getAndSetTime"
    @complete="$emit('add')"
  >
    <template #title>
      {{ editMode ? `Edit` : `Add` }}
    </template>

    <template #button>
      <button v-if="editMode" type="button" @click="$emit(`discard`)">Discard changes</button>
    </template>
  </CommentForm>
</template>
