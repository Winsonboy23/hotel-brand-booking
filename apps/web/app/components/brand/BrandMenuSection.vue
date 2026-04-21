<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface MenuCourse {
  sectionKey?: string
  name: string
  price: string
  desc: string
  section?: string
}

interface MenuGroup {
  key: string
  title: string
  items: MenuCourse[]
}

const props = defineProps<{
  title: string
  courses: MenuCourse[]
  brandKey?: string
  note?: string
  prevLabel: string
  nextLabel: string
}>()

const menuPage = ref(0)

const groupedCourses = computed<MenuGroup[]>(() => {
  const grouped = new Map<string, MenuGroup>()

  for (const course of props.courses) {
    const sectionKey = course.sectionKey ?? course.section ?? '__default__'
    if (!grouped.has(sectionKey)) {
      grouped.set(sectionKey, {
        key: sectionKey,
        title: sectionKey === '__default__' ? '' : (course.section ?? sectionKey),
        items: []
      })
    }

    grouped.get(sectionKey)!.items.push(course)
  }

  return Array.from(grouped.values())
})

const isQuexiAddonGroup = (group: MenuGroup) => {
  const source = `${group.key} ${group.title}`.toLowerCase()
  return source.includes('單點') || source.includes('add-on') || source.includes('トッピング')
}

const totalPages = computed(() => {
  if (props.brandKey === 'nanasen') return 3
  if (props.brandKey === 'quexi') return 2
  return 1
})

const visibleGroups = computed(() => {
  if (props.brandKey === 'nanasen') {
    if (menuPage.value === 0) {
      return groupedCourses.value.filter((group) => group.key === 'omakase' || group.key === 'lunch')
    }

    if (menuPage.value === 1) {
      return groupedCourses.value.filter((group) => group.key === 'alcohol')
    }

    return groupedCourses.value.filter((group) => group.key === 'soft')
  }

  if (props.brandKey === 'quexi') {
    if (menuPage.value === 0) {
      return groupedCourses.value.filter((group) => !isQuexiAddonGroup(group))
    }

    return groupedCourses.value.filter((group) => isQuexiAddonGroup(group))
  }

  return groupedCourses.value
})

watch(
  () => props.brandKey,
  () => {
    menuPage.value = 0
  }
)

const goPrevPage = () => {
  menuPage.value = (menuPage.value - 1 + totalPages.value) % totalPages.value
}

const goNextPage = () => {
  menuPage.value = (menuPage.value + 1) % totalPages.value
}

const courseRevealDelay = (groupIndex: number, itemIndex: number) => {
  return `${groupIndex * 90 + itemIndex * 70}ms`
}
</script>

<template>
  <section id="menu" class="anchor-section mx-auto max-w-[980px] px-6 py-20">
    <h2 v-reveal class="mb-8 text-center text-[18px] tracking-[0.2em]">{{ title }}</h2>

    <p v-if="note" v-reveal="120" class="mb-3 text-center text-[14px] text-[var(--brand-muted)]">
      {{ note }}
    </p>

    <div class="rounded-sm border border-[var(--brand-surface-border)] bg-[var(--brand-surface)] px-5 py-2 md:px-8">
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between border-b border-[var(--brand-divider)] py-3 text-[11px] text-[var(--brand-muted)]"
      >
        <button
          type="button"
          :aria-label="prevLabel"
          class="rounded border border-[var(--brand-divider)] px-2 py-1 text-[11px] tracking-[0.12em] hover:bg-black/5"
          @click="goPrevPage"
        >
          {{ prevLabel }}
        </button>
        <span class="tracking-[0.2em]">{{ menuPage + 1 }} / {{ totalPages }}</span>
        <button
          type="button"
          :aria-label="nextLabel"
          class="rounded border border-[var(--brand-divider)] px-2 py-1 text-[11px] tracking-[0.12em] hover:bg-black/5"
          @click="goNextPage"
        >
          {{ nextLabel }}
        </button>
      </div>

      <div :key="`menu-page-${brandKey}-${menuPage}`">
        <template v-for="(group, groupIndex) in visibleGroups" :key="group.key">
          <p v-if="group.title" class="border-b border-[var(--brand-divider)] pt-5 pb-3 text-center text-[11px] tracking-[0.35em] text-[var(--brand-muted)]">
            {{ group.title }}
          </p>
          <div
            v-for="(course, idx) in group.items"
            :key="`${group.key}-${course.name}-${idx}`"
            :class="[
              'course-reveal-item py-5 text-[12px] tracking-[0.12em]',
              idx !== group.items.length - 1 ? 'border-b border-[var(--brand-divider)]' : ''
            ]"
            :style="{ animationDelay: courseRevealDelay(groupIndex, idx) }"
          >
            <div class="flex items-start justify-between gap-3">
              <p class="text-[13px] tracking-[0.3em]">{{ course.name }}</p>
              <p class="shrink-0 text-right md:pl-8">{{ course.price }}</p>
            </div>
            <p v-if="course.desc" class="mt-2 text-[11px] text-[var(--brand-muted)]">{{ course.desc }}</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.course-reveal-item {
  opacity: 0;
  transform: translateY(12px);
  animation: menu-course-reveal 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes menu-course-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .course-reveal-item {
    animation-duration: 1ms;
    animation-delay: 0ms !important;
    transform: none;
  }
}
</style>
