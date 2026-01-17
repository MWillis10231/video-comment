<script setup lang="ts">
import type { CommentType } from '@/types';
import { ref, useTemplateRef } from 'vue';
import { convertTimeStampToDate, convertDateToTimeStamp, isFirstTimeStampOlder, parseTimeStamp } from '@/timestampService';
import { addSeconds } from "date-fns";
import { getTabId, sendMessageToTab } from '@/chromeTabsService';
import CommentForm from './CommentForm.vue';
import { COMMENT_KEY, EVENT_TYPE, EVENT_TYPE_CATEGORY, SETTINGS_KEY } from '@/enum';
import type { UUIDTypes } from 'uuid';
import { getSettingsValue } from '@/settingsService';

const emit = defineEmits(['add', 'edit', 'discard']);

const props = defineProps<{
  comment: CommentType;
  editMode?: boolean;
}>();

const videoDuration = ref(null)
const activeCategory = ref<EVENT_TYPE_CATEGORY | null>(null);

const updateActiveCategory = (category: EVENT_TYPE_CATEGORY | null) => {
  activeCategory.value = category;
}

interface CommentFormEmitParameters {
  field: COMMENT_KEY,
  value?: UUIDTypes | string | null | boolean | EVENT_TYPE,
}

interface CommentFormDateEmitParameters {
  field: COMMENT_KEY.START_TIMESTAMP | COMMENT_KEY.END_TIMESTAMP,
  value: string,
}

const getAndSetTime = async ({ field }: CommentFormDateEmitParameters) => {
  const tabId = await getTabId();

  if (tabId) {
    const response = await sendMessageToTab(tabId, { action: "getTime" }); // should be enums

    if (response) {
      const value = parseTimeStamp(response);
      const startTimeStampPadding = getSettingsValue(SETTINGS_KEY.START_TIMESTAMP_PADDING) as number || 0;

      const adjustedValue = convertDateToTimeStamp(addSeconds(convertTimeStampToDate(value), startTimeStampPadding));

      if (isFirstTimeStampOlder(adjustedValue, value)) { // prevents overflows
        handleEditTime({ field, value: adjustedValue });
      } else {
        handleEditTime({ field, value });
      }
    }
  }
}

const commentRef = useTemplateRef('comment');

const handleEdit = ({ field, value }: CommentFormEmitParameters) => {
  let commentToEmit;

  if (field === COMMENT_KEY.EVENT_TYPES) {
    commentToEmit = handleEditEventTypes(value)
  } else {
    commentToEmit = {
      ...props.comment,
      [field]: value
    }
  }

  emit('edit', commentToEmit);


  if (commentRef.value) {
    commentRef.value.focus();
  }
}

const handleEditEventTypes = (eventType: EVENT_TYPE) => {
  const currentEventTypes = props.comment.eventTypes ?? [];

  const newEventTypes = currentEventTypes.includes(eventType) ? currentEventTypes.filter((type) => type !== eventType) : [...currentEventTypes, eventType];

  let commentToEmit = {
    ...props.comment,
    [COMMENT_KEY.EVENT_TYPES]: newEventTypes
  }

  if (eventType === EVENT_TYPE.GOAL) {
    commentToEmit = {
      ...commentToEmit,
      includeOnHighlights: true,
    }
  }

  return commentToEmit
}

const handleAddTime = ({ field, value }: CommentFormDateEmitParameters) => {
  let currentValue = props.comment[field] ?? '';

  if (!currentValue && field === COMMENT_KEY.END_TIMESTAMP) {
    currentValue = props.comment.startTimestamp;
  } else if (!currentValue) {
    currentValue = '00:00:00';
  }

  const currentTime = convertTimeStampToDate(currentValue);
  const newTime = addSeconds(currentTime, value);
  const newTimeStamp = convertDateToTimeStamp(newTime);

  handleEditTime({ field, value: newTimeStamp });
}

const handleEditTime = async ({ field, value }: CommentFormDateEmitParameters) => {
  if (field === COMMENT_KEY.END_TIMESTAMP) {
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

const handleQuit = () => {
  if (activeCategory.value !== null) {
    activeCategory.value = null;
  } else if (props.editMode) {
    emit('discard');
  }
}

getVideoDuration();
</script>

<template>
  <CommentForm
    :activeCategory="activeCategory"
    :comment="comment"
    @edit="handleEdit"
    @editTime="handleEditTime"
    @addTime="handleAddTime"
    @getAndSetTime="getAndSetTime"
    @complete="$emit('add')"
    @updateCategory="updateActiveCategory"
    @quit="handleQuit"
  >
    <template #title>
      {{ editMode ? `Edit` : `Add` }}
    </template>

    <template #button>
      <button v-if="editMode" type="button" @click="$emit(`discard`)">Discard changes</button>
    </template>

    <template #buttonHint>
      <template v-if="editMode">esc</template>
    </template>
  </CommentForm>
</template>
