<script setup lang="ts">
import { EVENT_TYPE_CATEGORY_MAP, EVENT_TYPE_TO_DESCRIPTION_MAP } from '@/constants';
import type { CommentType } from '@/types';
import Comment from './Comment.vue';
import { useTemplateRef } from 'vue';
import { convertTimeStampToDate, convertDateToTimeStamp, validateTimeStamp, isTimeStampTruthy, isFirstTimeStampOlderThanSecondTimeStamp } from '@/timestampService';
import { addSeconds } from "date-fns";
import TimeStampEdit from './TimeStampEdit.vue';

const emit = defineEmits(['add', 'edit', 'discard']);

const props = defineProps<{
  comment: CommentType;
  editMode?: boolean;
}>();

const getAndSetTime = async (field) => {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  const response = await chrome.tabs.sendMessage(tab.id, { action: "getTime" });
  // do something with response here, not outside the function

  handleEditTime({ field, time: validateTimeStamp(response) });  
}

const commentRef = useTemplateRef('comment');

const handleEdit = ({ field, value }) => {
  emit('edit', {
    ...props.comment,
    [field]: value
  });

  if (commentRef.value) {
    commentRef.value.focus();
  }
}

const handleAddTime = (time: number, field: string) => {
  let currentValue = props.comment[field];

  if (!isTimeStampTruthy(currentValue)) {
    if (field === 'startTimestamp') {
      currentValue = '00:00:00';
    } else if (field === 'endTimestamp' && props.comment.startTimestamp) {  
      currentValue = props.comment.startTimestamp ?? '00:00:00';
    }
  }

  const currentTime = convertTimeStampToDate(currentValue);
  const newTime = addSeconds(currentTime, time);
  const newTimeStamp = convertDateToTimeStamp(newTime);

  handleEditTime({ field, time: newTimeStamp });
}

const handleEditTime = ({ field, time }) => {
  if (field === 'endTimestamp' && isFirstTimeStampOlderThanSecondTimeStamp(props.comment.startTimestamp, time)) {
    return;
  }

  handleEdit({ field, value: time });
}
</script>

<template>
  <form>
    <h2>{{ editMode ? `Edit` : `Add` }} Comment</h2>

    <div class="timestamps">
      <h3>Timestamps</h3>

      <TimeStampEdit
        :timestamp="validateTimeStamp(comment.startTimestamp)"
        @update="handleEditTime({ field: 'startTimestamp', time: $event })"
        @add="handleAddTime($event, 'startTimestamp')"
        @getAndSetTime="getAndSetTime('startTimestamp')"
        @clear="handleEdit({ field: 'startTimestamp', value: '' })"
      >
        Start
      </TimeStampEdit>

      <TimeStampEdit
        :timestamp="validateTimeStamp(comment.endTimestamp)"
        @update="handleEditTime({ field: 'endTimestamp', time: $event })"
        @add="handleAddTime($event, 'endTimestamp')"
        @getAndSetTime="getAndSetTime('endTimestamp')"
        @clear="handleEdit({ field: 'endTimestamp', value: '' })"
      >
        End
      </TimeStampEdit>
    </div>

    <div>
      <h3>Event type</h3>

      <div class="category" v-for="(category, index) in EVENT_TYPE_CATEGORY_MAP" :key="index">
        <h4>{{ category.name }} {{ category.emoji }}</h4>

        <div class="buttons">
          <button 
            v-for="(type, index) in category.eventTypes" 
            :class="['button', { ['active']: comment.eventType === type }]"
            type="button"
            :key="index" 
            @click="handleEdit({ field: 'eventType', value: type })"
          >
            {{ EVENT_TYPE_TO_DESCRIPTION_MAP[type] }}
          </button>
        </div>
      </div>

      <div>
        ⭐ Include on highlights:
        <input 
          type="checkbox" 
          :value="comment.includeOnHighlights" 
          :checked="comment.includeOnHighlights" 
          @input="$emit('edit', 
            {
              ...comment,
              includeOnHighlights: ($event.target as HTMLInputElement).checked
            }
          )"
        >
      </div>

      <div>
        <label>
          Extra Explanation
          <textarea 
            id="comment"
            ref="comment"
            :value="comment.explanation"
            @input="handleEdit({ field: 'explanation', value: ($event.target as HTMLInputElement).value })"
          />
        </label>
      </div>
    </div>

    <div>
      <h3>Comment Preview</h3>

      <Comment :comment="comment" />

      <div class="submitButtons">
        <button type="button" @click="$emit(`add`)">{{ editMode ? `Save` : `Add` }} comment</button>
        <button v-if="editMode" type="button" @click="$emit(`discard`)">Discard changes</button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.timestamps {
  display: flex;
  flex-direction: column;
  gap: .5rem;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: .1rem;
}

.submitButtons {
  display: flex;
  gap: .5rem;
  margin-top: 1rem;
}

textarea {
  width: 100%;
}
</style>
