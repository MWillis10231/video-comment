<script setup lang="ts">
  defineProps({
    oldKOTime: {
      type: String,
      required: true,
    },
    newKOTime: {
      type: String,
      required: true,
    },
  });

  defineEmits(['convert', 'update']);
</script>

<template>
  <div>
    <label name="old-KO-time">
      <input
        type="text"
        placeholder="00:00:00"
        :value="oldKOTime"
        @input="$emit('update',
          {
            field: 'oldKOTime',
            value: $event.target.value,
          }
        )"
      />

      Old KO time
    </label>

    <label name="old-KO-time">
      <input
        type="text"
        placeholder="00:00:00"
        :value="newKOTime"
        @input="$emit('update',
          {
            field: 'newKOTime',
            value: $event.target.value,
          }
        )"
      />

      New KO time
    </label>

    <button @click="$emit('convert')">Convert timestamps</button>
  </div>
</template>
