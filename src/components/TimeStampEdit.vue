<script setup lang="ts">
defineEmits(['update', 'add', 'getAndSetTime', 'clear']);

const PLACEHOLDER = '00:00:00';

defineProps<{
    timestamp: string;
  }>();
</script>

<template>
  <label class="timestamp">
    <span class="timestampLabel">
      <slot />
    </span>

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
          📺
        </button>
      </div>

      <div class="timestampContainer">
        <button
          type="button"
          class="timestampTimeButton"
          @click="$emit('add', -15)"
        >
          -15
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', -10)"
        >
          -10
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', -5)"
        >
          -5
        </button>

        <button
          type="button"
          @click="$emit('clear')"
        >
          ❌
        </button>

        <button
          type="button"
          class="timestampTimeButton"
          @click="$emit('add', 5)"
        >
          +5
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', 10)"
        >
          +10
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', 15)"
        >
          +15
        </button>

        <button
          class="timestampTimeButton"
          type="button"
          @click="$emit('add', 30)"
        >
          +30
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

.timestampInput {

}

.timestampLabel {
  width: 2.2em;
}

.timestampTimeButton {
  font-size: .7rem;
  text-align: left;
  width: 1.5rem;
}
</style>
