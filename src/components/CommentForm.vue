<script setup lang="ts">
import { EVENT_TYPE_CATEGORY_MAP, EVENT_TYPE_TO_DESCRIPTION_MAP } from '@/constants';
import type { CommentType } from '@/types';
import Comment from './Comment.vue';
import { parseTimeStamp } from '@/timestampService';
import TimeStampEdit from './TimeStampEdit.vue';
import { computed } from 'vue';
import StarIcon from './Icons/StarIcon.vue';
import TrophyIcon from './Icons/TrophyIcon.vue';

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
        Start <span class="hint">alt+s</span>
      </TimeStampEdit>

      <TimeStampEdit
        :timestamp="endTimeStampToDisplay"
        @update="$emit('editTime', { field: 'endTimestamp', value: $event })"
        @add="$emit('addTime', { field: 'endTimestamp', value: $event })"
        @getAndSetTime="$emit(`getAndSetTime`, { field: 'endTimestamp'})"
        @clear="$emit(`editTime`, { field: 'endTimestamp', value: null })"
      >
        End <span class="hint">alt+e</span>
      </TimeStampEdit>
    </div>

    <div>
      <h3>Event type</h3>

      <div class="category" v-for="(category, index) in EVENT_TYPE_CATEGORY_MAP" :key="index">
        <h4 class="categoryName">{{ category.name }} <component :is="category.icon" class="icon" /> <span class="hint">alt+{{category.keyboardKey}}</span></h4>

        <div class="buttons">
          <button
            v-for="(type, index) in category.eventTypes"
            :class="['button', { ['active']: comment.eventTypes === type }]"
            type="button"
            :key="index"
            @click="$emit('edit', { field: 'eventTypes', value: type })"
          >
            {{ EVENT_TYPE_TO_DESCRIPTION_MAP[type] }} <span class="number">{{ index + 1 }}</span>
          </button>
        </div>
      </div>

      <div>
        <StarIcon class="icon star" /> Include on video highlights:

        <input
          type="checkbox"
          :value="comment.includeOnHighlights"
          :checked="comment.includeOnHighlights"
          @input="$emit('edit', { field: 'includeOnHighlights', value: ($event.target as HTMLInputElement).checked })"
        >

        <span class="hint">alt+v</span>
      </div>

      <div>
        <TrophyIcon class="icon star" /> Shortlist for award:

        <input
          type="checkbox"
          :value="comment.includeOnAwardShortlist"
          :checked="comment.includeOnAwardShortlist"
          @input="$emit('edit', { field: 'includeOnAwardShortlist', value: ($event.target as HTMLInputElement).checked })"
        >

        <span class="hint">alt+x</span>
      </div>

      <div>
        <label>
          Extra Explanation <span class="hint">alt+c</span>
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
        <button type="button" @click="$emit(`complete`)"><slot name="title" /> comment</button> <span class="hint">alt+enter</span>
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

.button {
  font-size: smaller;
}

.submitButtons {
  display: flex;
  gap: .5rem;
  margin-top: 1rem;
}

.hint {
  font-weight: normal;
  font-size: 0.75rem;
  color: gray;
  margin-left: .25rem;
}

textarea {
  width: 100%;
}

.icon {
  fill: white;
}

.star {
  fill: gold;
}

.category {
  margin-bottom: .5rem;
}

.categoryName {
  justify-content: start;
  gap: .25rem;
}

.number {
  color: gray;
  vertical-align: super;
}
</style>
