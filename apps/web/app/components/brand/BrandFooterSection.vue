<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  brandName: string
  logoAlt: string
  logoSrc: string
  phone: string
  address: string
  instagramUrl: string
  facebookUrl: string
  instagramLabel: string
  facebookLabel: string
}>()

const currentYear = new Date().getFullYear()
const hasInstagram = computed(() => Boolean(props.instagramUrl?.trim()))
const hasFacebook = computed(() => Boolean(props.facebookUrl?.trim()))
const hasPhone = computed(() => Boolean(props.phone?.trim()))
const hasAddress = computed(() => Boolean(props.address?.trim()))
</script>

<template>
  <footer class="anchor-section bg-[var(--brand-accent)] px-6 py-10 text-white">
    <div class="mx-auto grid w-full max-w-[980px] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
      <div v-reveal class="flex items-center justify-center md:justify-start">
        <img :src="props.logoSrc" :alt="props.logoAlt" class="h-16 w-16 object-contain md:h-20 md:w-20" />
      </div>

      <div v-reveal="160" class="order-3 text-center md:order-2">
        <p class="text-[11px] tracking-[0.08em] text-white/80">
          © {{ currentYear }} {{ props.brandName }}. All rights reserved.
        </p>
      </div>

      <div v-reveal="80" class="order-2 flex flex-col items-center gap-2 text-center md:order-3 md:items-end md:text-right">
        <div class="flex items-center gap-2">
          <a
            v-if="hasInstagram"
            :href="props.instagramUrl"
            :aria-label="props.instagramLabel"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M12 2.16c3.2 0 3.58.01 4.84.07 3.23.15 4.73 1.68 4.88 4.88.06 1.26.07 1.64.07 4.84 0 3.2-.01 3.58-.07 4.84-.15 3.2-1.65 4.73-4.88 4.88-1.26.06-1.64.07-4.84.07-3.2 0-3.58-.01-4.84-.07-3.24-.15-4.73-1.69-4.88-4.88-.06-1.26-.07-1.64-.07-4.84 0-3.2.01-3.58.07-4.84.15-3.21 1.65-4.73 4.88-4.88 1.26-.06 1.64-.07 4.84-.07m0-2.16C8.74 0 8.33.01 7.06.07c-4.35.2-6.79 2.64-7 7C0 8.33 0 8.74 0 12c0 3.26.01 3.67.07 4.94.21 4.35 2.65 6.79 7 7 1.27.06 1.68.06 4.94.06 3.26 0 3.67 0 4.94-.06 4.35-.21 6.79-2.65 7-7 .06-1.27.06-1.68.06-4.94 0-3.26 0-3.67-.06-4.94-.21-4.35-2.65-6.79-7-7C15.67.01 15.26 0 12 0z"/>
              <path d="M12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 1 0 12 5.84zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8zM18.41 4.15a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 1 0 0-2.88z"/>
            </svg>
          </a>
          <a
            v-if="hasFacebook"
            :href="props.facebookUrl"
            :aria-label="props.facebookLabel"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/40 transition-colors hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.53-4.71 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.29h3.33l-.53 3.49h-2.8V24C19.61 23.08 24 18.09 24 12.07z"/>
            </svg>
          </a>
        </div>

        <p v-if="hasPhone" class="text-[11px] tracking-[0.08em] text-white/85">
          {{ props.phone }}
        </p>
        <p v-if="hasAddress" class="text-[11px] tracking-[0.08em] text-white/85">
          {{ props.address }}
        </p>
      </div>
    </div>
  </footer>
</template>
