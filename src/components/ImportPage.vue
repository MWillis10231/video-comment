<script setup lang="ts">
import { getTabId, sendMessageToTab } from '@/chromeTabsService';
import { parseComments, retrieveStoredCommentsFromLocalStorage, sortComments, storeCommentsInLocalStorage } from '@/commentService';
import type { CommentType } from '@/types';
import { ref, type Ref } from 'vue';
import CustomLabel from './CustomLabel.vue';
import CommentContainer from './CommentContainer.vue';
import { convertDateToTimeStamp, convertTimeStampToDate } from '@/timestampService';
import { addSeconds, differenceInSeconds } from 'date-fns';
import TimeShift from './TimeShift.vue';
import { EVENT_TYPE_TO_DESCRIPTION_MAP } from '@/constants';
import CopyAllIcon from './Icons/CopyAllIcon.vue';
import TimerIcon from './Icons/TimerIcon.vue';
import ImportIcon from './Icons/ImportIcon.vue';
import AddIcon from './Icons/AddIcon.vue';
import ConvertIcon from './Icons/ConvertIcon.vue';


const comments = ref([]) as Ref<CommentType[]>;
const oldKOTime = ref('00:00:00');
const newKOTime = ref('00:00:30');

const getStoredComments = () => {
  comments.value = retrieveStoredCommentsFromLocalStorage();
}

const storeComments = () => storeCommentsInLocalStorage(comments.value);

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

const updateOldKOTime = (event: Event) => {
  const input = event.target as HTMLInputElement;
  oldKOTime.value = input.value;

  oldKOTime.value = input.value ?? '00:00:00';
};

const updateNewKOTime = (event: Event) => {
  const input = event.target as HTMLInputElement;
  newKOTime.value = input.value;
};

const adjustTimeStamps = () => {
  if (oldKOTime.value && newKOTime.value) {
    const oldKODate = convertTimeStampToDate(oldKOTime.value);
    const newKODate = convertTimeStampToDate(newKOTime.value);

    comments.value = comments.value.map((comment) => {
      const startTime = convertTimeStampToDate(comment.startTimestamp);
      const adjustedStartTime = addSeconds(startTime, differenceInSeconds(newKODate, oldKODate));

      let adjustedEndTime;

      if (comment.endTimestamp) {
        const endTime = convertTimeStampToDate(comment.endTimestamp);

        adjustedEndTime = addSeconds(endTime, differenceInSeconds(newKODate, oldKODate));
      }

      return {
          ...comment,
          startTimestamp: convertDateToTimeStamp(adjustedStartTime),
          endTimestamp: adjustedEndTime ? convertDateToTimeStamp(adjustedEndTime) : adjustedEndTime,
        };
    });
  }
  storeComments();
}

const generateEndTimestamps = () => {
  comments.value = comments.value.map((comment) => {
    if (!comment.endTimestamp) {
      const startTime = convertTimeStampToDate(comment.startTimestamp);
      const endTime = addSeconds(startTime, 10); // Default duration of 10 seconds

        return {
        ...comment,
        endTimestamp: convertDateToTimeStamp(endTime),
      };
    }

    return comment;
  });

  storeComments();
};

const convertTimeStampsToCorrectFormat = () => {
  comments.value = comments.value.map((comment) => {
    return {
      ...comment,
      startTimestamp: convertDateToTimeStamp(convertTimeStampToDate(comment.startTimestamp)),
      endTimestamp: comment.endTimestamp ? convertDateToTimeStamp(convertTimeStampToDate(comment.endTimestamp)) : comment.endTimestamp,
    };
  });

  storeComments();
};

const padStartAndEndTimestamp = () => {
  comments.value = comments.value.map((comment) => {
    return {
      ...comment,
      startTimestamp: convertDateToTimeStamp(addSeconds(convertTimeStampToDate(comment.startTimestamp), -5)),
      endTimestamp: comment.endTimestamp ? convertDateToTimeStamp(addSeconds(convertTimeStampToDate(comment.endTimestamp), 5)) : comment.endTimestamp,
    };
  });

  storeComments();
};

const copyAllCommentsAsCSV = () => {
  const replaceSpacesWithUnderscores = (text: string) => {
    return text.replace(/ /g, '_');
  };

  const replaceCommasWithDashes = (text: string) => {
    return text.replace(/,/g, '-');
  };

  const sanitiseExplanation = (text: string) => {
    return replaceSpacesWithUnderscores(replaceCommasWithDashes(text));
  };


  const csvContent = comments.value.map((comment) => {
    return `${comment.startTimestamp},${comment.endTimestamp},${replaceSpacesWithUnderscores(comment.eventTypes.map((eventType) => EVENT_TYPE_TO_DESCRIPTION_MAP[eventType]).join(','))},"${sanitiseExplanation(comment.explanation)}${comment.includeOnHighlights ? '-IMP' : ''}"`;
  }).join('\n');

  navigator.clipboard.writeText(csvContent);
};

getStoredComments();
</script>

<template>
  <div class="page">
    <div class="buttons">
      <CustomLabel name="remove-all-comments">
          <button
            @click="readCommentsFromPage"
          >
            <ImportIcon class="icon" />
          </button>
          <template #tooltip>Import comments from page</template>
        </CustomLabel>

      <CustomLabel name="generate-end-timestamps">
        <button
          @click="generateEndTimestamps"
        >
          <TimerIcon class="icon" />
        </button>
        <template #tooltip>Generate end timestamps for comments without them</template>
      </CustomLabel>

      <CustomLabel name="convert-timestamps-format">
        <button
          @click="convertTimeStampsToCorrectFormat"
        >
          <ConvertIcon class="icon" />
        </button>
        <template #tooltip>Convert all timestamps to correct format</template>
      </CustomLabel>

      <CustomLabel name="pad-start-end-timestamps">
        <button
          @click="padStartAndEndTimestamp"
        >
          <AddIcon class="icon" />
        </button>
        <template #tooltip>Pad start and end timestamps by 5 seconds</template>
      </CustomLabel>

      <CustomLabel name="copy-comments-csv">
        <button
          @click="copyAllCommentsAsCSV"
        >
          <CopyAllIcon class="icon" />
        </button>
        <template #tooltip>Copy all comments as CSV to clipboard</template>
      </CustomLabel>
    </div>

    <!-- TODO check this works -->
    <TimeShift
      :oldKOTime="oldKOTime"
      :newKOTime="newKOTime"
      @update:oldKOTime="updateOldKOTime"
      @update:newKOTime="updateNewKOTime"
      @convert="adjustTimeStamps"
    />

    <ul ref="commentsList">
        <CommentContainer
          v-for="(comment, index) in comments"
          :key="index"
          :comment="comment"
          hideButtons
        />
      </ul>
  </div>
</template>

<style scoped>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .buttons {
    align-items: center;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
  }
</style>
