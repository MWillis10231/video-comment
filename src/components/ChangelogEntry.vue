<template>
  <h4>
    <slot name="version" />
  </h4>

  <template v-if="$slots.major">
    <h5>
      Breaking Changes
    </h5>

    <ul>
      <slot name="major" />
    </ul>
  </template>

  <template  v-if="$slots.minor">
    <h5>
      Features
    </h5>

    <ul>
      <slot name="minor" />
    </ul>
  </template>

  <template v-if="$slots.bug">
    <h5>
      Bug Fixes
    </h5>

    <ul>
      <slot name="bug" />
    </ul>
  </template>
</template>