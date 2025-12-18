<script setup lang="ts">
import { EVENT_TYPE_CATEGORY_MAP, EVENT_TYPE_TO_DESCRIPTION_MAP } from '@/constants';
import type { CommentType } from '@/types';
import Comment from './Comment.vue';
import { parseTimeStamp } from '@/timestampService';
import TimeStampEdit from './TimeStampEdit.vue';
import { computed } from 'vue';

defineEmits(['edit', 'editTime', 'addTime', 'getAndSetTime', 'complete']);

const props = defineProps<{
  comment: CommentType;
}>();

const endTimeStampToDisplay = computed(() => {
  return props.comment.endTimestamp ? parseTimeStamp(props.comment.endTimestamp) : '00:00:00';
});
</script>

<template>
  <form>
    <h2>
      <slot name="title" />

      Comment
    </h2>

    <div class="timestamps">
      <h3>Timestamps</h3>

      <TimeStampEdit
        :timestamp="parseTimeStamp(comment.startTimestamp)"
        @update="$emit('editTime', { field: 'startTimestamp', value: $event })"
        @add="$emit('addTime', { field: 'startTimestamp', value: $event })"
        @getAndSetTime="$emit(`getAndSetTime`, { field: 'startTimestamp'})"
        @clear="$emit(`editTime`, { field: 'startTimestamp', value: '00:00:00' })"
      >
        Start
      </TimeStampEdit>

      <TimeStampEdit
        :timestamp="endTimeStampToDisplay"
        @update="$emit('editTime', { field: 'endTimestamp', value: $event })"
        @add="$emit('addTime', { field: 'endTimestamp', value: $event })"
        @getAndSetTime="$emit(`getAndSetTime`, { field: 'endTimestamp'})"
        @clear="$emit(`editTime`, { field: 'endTimestamp', value: null })"
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
            @click="$emit('edit', { field: 'eventType', value: type })"
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
          @input="$emit('edit', { field: 'includeOnHighlights', value: ($event.target as HTMLInputElement).checked })"
        >
      </div>

      <div>
        <label>
          Extra Explanation
          <textarea
            id="comment"
            ref="comment"
            :value="comment.explanation"
            @input="$emit('edit', { field: 'explanation', value: ($event.target as HTMLInputElement).value })"
          />
        </label>
      </div>
    </div>

    <div>
      <h3>Comment Preview</h3>

      <Comment :comment="comment" />

      <div class="submitButtons">
        <button type="button" @click="$emit(`complete`)"><slot name="title" /> comment</button>
        <slot name="button" />
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
