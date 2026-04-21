<script setup lang="ts">
defineProps<{
  greetingLines: string[]
  vertical?: boolean
}>()
</script>

<template>
  <section id="greeting" class="anchor-section mx-auto flex max-h-[400px] justify-center px-6 py-15">
    <p v-reveal :class="[vertical !== false ? 'vertical-jp' : 'leading-[2.2]', 'text-[13px] md:text-[14px]']">
      <template v-for="(line, index) in greetingLines" :key="line + index">
        {{ line }}
        <br />
      </template>
    </p>
  </section>
</template>
