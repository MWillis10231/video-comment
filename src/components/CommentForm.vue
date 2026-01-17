<script setup lang="ts">
import { EVENT_TYPE_CATEGORY_MAP, EVENT_TYPE_TO_DESCRIPTION_MAP, VALID_NUMBER_KEYS } from '@/constants';
import type { CommentType } from '@/types';
import Comment from './Comment.vue';
import { parseTimeStamp } from '@/timestampService';
import TimeStampEdit from './TimeStampEdit.vue';
import { computed } from 'vue';
import StarIcon from './Icons/StarIcon.vue';
import TrophyIcon from './Icons/TrophyIcon.vue';
import { COMMENT_KEY, EVENT_TYPE, EVENT_TYPE_CATEGORY } from '@/enum';

const emit = defineEmits(['edit', 'editTime', 'addTime', 'getAndSetTime', 'complete', 'updateCategory', 'quit']);

const props = defineProps<{
  comment: CommentType;
  activeCategory: EVENT_TYPE_CATEGORY | null;
}>();

const endTimeStampToDisplay = computed(() => {
  return props.comment.endTimestamp ? parseTimeStamp(props.comment.endTimestamp) : '00:00:00';
});
const canSubmitComment = computed(() => {
  return props.comment.eventTypes.length > 0;
});

const handleGetAndSetTime = (field: COMMENT_KEY) => emit(`getAndSetTime`, { field })
const handleUpdateCategory = (category: EVENT_TYPE_CATEGORY | null) =>  emit('updateCategory', category);
const handleIncludeOnHighlightsChange = (value: boolean) => emit('edit', { field: COMMENT_KEY.INCLUDE_ON_HIGHLIGHTS, value });
const handleIncludeOnAwardShortlistChange = (value: boolean) => emit('edit', { field: COMMENT_KEY.INCLUDE_ON_AWARD_SHORTLIST, value });
const handleEditEventType = (value: EVENT_TYPE) => emit('edit', { field: COMMENT_KEY.EVENT_TYPES, value })

const isNumberKey = (key: string) => VALID_NUMBER_KEYS.includes(key);

const handleNumberKeyPress = (key: string, category: EVENT_TYPE_CATEGORY) => {
  const keyAsNumber = Number(key);
  const eventTypeIndex = keyAsNumber - 1;
  const eventCategoryType = EVENT_TYPE_CATEGORY_MAP[category].eventTypes[eventTypeIndex]

  if (eventCategoryType !== undefined) {
    handleEditEventType(eventCategoryType);
  }
}

addEventListener('keydown', (event) => {
  const eventKeyLowerCase = event.key.toLowerCase();

  if (event.altKey) {
    switch (eventKeyLowerCase) {
      case 'q':
        event.preventDefault();
        emit('quit');
        break;
      case 's':
        event.preventDefault();
        handleGetAndSetTime(COMMENT_KEY.START_TIMESTAMP);
        handleUpdateCategory(null);
        break;
      case 'e':
        event.preventDefault();
        handleGetAndSetTime(COMMENT_KEY.END_TIMESTAMP);
        handleUpdateCategory(null);
        break;
      case 'a':
        event.preventDefault();
        handleUpdateCategory(EVENT_TYPE_CATEGORY.ATTACK);
        break;
      case 'd':
        event.preventDefault();
        handleUpdateCategory(EVENT_TYPE_CATEGORY.DEFENSE);
        break;
      case 'f':
        event.preventDefault();
        handleUpdateCategory(EVENT_TYPE_CATEGORY.DISCIPLINE);
        break;
      case 'r':
        event.preventDefault();
        handleUpdateCategory(EVENT_TYPE_CATEGORY.SET_PIECE);
        break;
      case 't':
        event.preventDefault();
        handleUpdateCategory(EVENT_TYPE_CATEGORY.TEMPORAL);
        break;
      case 'w':
        event.preventDefault();
        handleUpdateCategory(EVENT_TYPE_CATEGORY.OTHER);
        break;
      case 'v':
        event.preventDefault();
        handleIncludeOnHighlightsChange(!props.comment.includeOnHighlights);
        handleUpdateCategory(null);
        break;
      case 'x':
        event.preventDefault();
        handleIncludeOnAwardShortlistChange(!props.comment.includeOnAwardShortlist);
        handleUpdateCategory(null);
        break;
      case 'c':
        event.preventDefault();
        const commentElement = document.getElementById('comment');
        if (commentElement) {
          commentElement.focus();
        }
        handleUpdateCategory(null);
        break;
      case 'enter':
        event.preventDefault();
        handleUpdateCategory(null);
        if (canSubmitComment.value) {
          emit('complete');
        }
        break;
    }
  } else {
    if (isNumberKey(eventKeyLowerCase)) {
      if (props.activeCategory !== null) {
        const category = props.activeCategory

        handleNumberKeyPress(eventKeyLowerCase, category);
      }
    }
  }
})
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
        @update="$emit('editTime', { field: COMMENT_KEY.START_TIMESTAMP, value: $event })"
        @add="$emit('addTime', { field: COMMENT_KEY.START_TIMESTAMP, value: $event })"
        @getAndSetTime="handleGetAndSetTime(COMMENT_KEY.START_TIMESTAMP)"
        @clear="$emit(`editTime`, { field: COMMENT_KEY.START_TIMESTAMP, value: '00:00:00' })"
      >
        Start <span class="hint">alt+s</span>
      </TimeStampEdit>

      <TimeStampEdit
        :timestamp="endTimeStampToDisplay"
        @update="$emit('editTime', { field: COMMENT_KEY.END_TIMESTAMP, value: $event })"
        @add="$emit('addTime', { field: COMMENT_KEY.END_TIMESTAMP, value: $event })"
        @getAndSetTime="$emit(`getAndSetTime`, { field: COMMENT_KEY.END_TIMESTAMP })"
        @clear="$emit(`editTime`, { field: COMMENT_KEY.END_TIMESTAMP, value: null })"
      >
        End <span class="hint">alt+e</span>
      </TimeStampEdit>
    </div>

    <div>
      <h3>Event type <span class="hint">alt+q to quit</span></h3>

      <div :class="['category', { ['active']: activeCategory === category.id }]" v-for="(category, index) in EVENT_TYPE_CATEGORY_MAP" :key="index">
        <h4 class="categoryName">{{ category.name }} <component :is="category.icon" class="icon" /> <span class="hint">alt+{{category.keyboardKey}}</span></h4>

        <div class="buttons">
          <button
            v-for="(type, index) in category.eventTypes"
            :class="['button', { ['active']: comment.eventTypes.includes(type) }]"
            type="button"
            :key="index"
            @click="$emit('edit', { field: COMMENT_KEY.EVENT_TYPES, value: type })"
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
          @input="handleIncludeOnHighlightsChange(($event.target as HTMLInputElement).checked)"
        >

        <span class="hint">alt+v</span>
      </div>

      <div>
        <TrophyIcon class="icon star" /> Shortlist for award:

        <input
          type="checkbox"
          :value="comment.includeOnAwardShortlist"
          :checked="comment.includeOnAwardShortlist"
          @input="handleIncludeOnAwardShortlistChange(($event.target as HTMLInputElement).checked)"
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
            @input="$emit('edit', { field: COMMENT_KEY.EXPLANATION, value: ($event.target as HTMLInputElement).value })"
          />
        </label>
      </div>
    </div>

    <div>
      <h3>Comment Preview</h3>

      <Comment :comment="comment" />

      <div class="submitButtons">
        <div>
          <button type="button" :disabled="!canSubmitComment" @click="$emit(`complete`)"><slot name="title" /> comment</button> <span class="hint">alt+enter</span>
        </div>

        <div>
          <slot name="button" />

          <span class="hint"><slot name="buttonHint" /></span>
        </div>
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
  flex-direction: column;
  gap: .5rem;
  margin-top: 1rem;

  button {
    width: fit-content;
  }
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

.star {
  fill: gold;
}

.category {
  border: 1px dotted transparent;
  border-radius: 5px;
  padding: .25rem;

  &.active {
    border-color: light-dark(var(--light-highlight-color), var(--dark-highlight-color));
  }
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
