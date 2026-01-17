<script setup lang="ts">
import CloseIcon from './Icons/CloseIcon.vue';
import ForwardFiveIcon from './Icons/ForwardFiveIcon.vue';
import ForwardTenIcon from './Icons/ForwardTenIcon.vue';
import ForwardThirtyIcon from './Icons/ForwardThirtyIcon.vue';
import ReplayFiveIcon from './Icons/ReplayFiveIcon.vue';
import ReplayTenIcon from './Icons/ReplayTenIcon.vue';
import ReplayThirtyIcon from './Icons/ReplayThirtyIcon.vue';
import TimerIcon from './Icons/TimerIcon.vue';

defineEmits(['update', 'add', 'getAndSetTime', 'clear']);

const PLACEHOLDER = '00:00:00';

defineProps<{
    timestamp: string;
  }>();
</script>

<template>
  <label class="timestamp">
    <div class="timestampLabel">
      <slot />
    </div>

      <div class="timestampContainer">
        <input
          class="timestampInput"
          :class="{
            'timestampInputPlaceholder': timestamp === PLACEHOLDER,
          }"
          type="text"
          :placeholder="PLACEHOLDER"
          :value="timestamp"
          @input="$emit('update', ($event.target as HTMLInputElement).value)"
        >

        <button
          type="button"
          @click="$emit('getAndSetTime')"
        >
          <TimerIcon class="icon" />
        </button>
      </div>

      <div class="timestampContainer">
        <button
          type="button"
          class="timestampTimeButton"
          @click="$emit('add', -30)"
        >
          <ReplayThirtyIcon class="icon" />
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', -10)"
        >
          <ReplayTenIcon class="icon" />
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', -5)"
        >
          <ReplayFiveIcon class="icon" />
        </button>

        <button
          type="button"
          @click="$emit('clear')"
        >
          <CloseIcon class="icon close" />
        </button>

        <button
          type="button"
          class="timestampTimeButton"
          @click="$emit('add', 5)"
        >
          <ForwardFiveIcon class="icon" />
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', 10)"
        >
          <ForwardTenIcon class="icon" />
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', 30)"
        >
          <ForwardThirtyIcon class="icon" />
        </button>
      </div>
  </label>
</template>

<style scoped>
.timestamp {
  display: flex;
  flex-direction: column;
  gap: .2rem;
}

.timestampContainer {
  display: flex;
  gap: .2rem;
}

.close {
  fill: red;
}

.timestampTimeButton {
  align-items: center;
  display: inline-flex;
  justify-content: center;
  padding: 0;
  width: 2rem;
}
</style>
