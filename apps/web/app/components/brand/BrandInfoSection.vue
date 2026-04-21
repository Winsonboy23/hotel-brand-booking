<script setup lang="ts">
defineProps<{
  title: string
  rows: { label: string; value: string }[]
}>()
</script>

<template>
  <section class="mx-auto max-w-[980px] px-6 py-20">
    <h2 class="mb-10 text-center text-[12px] tracking-[0.5em]">{{ title }}</h2>
    <div class="info-grid">
      <div v-for="row in rows" :key="row.label" class="info-row grid grid-cols-1 gap-2 px-1 py-5 text-[12px] md:grid-cols-[180px_1fr]">
        <div class="tracking-[0.3em]">{{ row.label }}</div>
        <div class="tracking-[0.12em]">{{ row.value }}</div>
      </div>
    </div>
  </section>
</template>
