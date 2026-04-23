import { activities as fallbackActivities, rooms as fallbackRooms, stayPolicies } from '~/data/hotel'

type RoomContent = {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  size: string
  occupancy: string
  bedType: string
  priceFrom: number
  image: string
  gallery: string[]
  highlights: string[]
  amenities: string[]
}

type ActivityContent = {
  id: string
  title: string
  description: string
  amount: number
  startsAt: string
  endsAt: string
}

type PolicyContent = {
  id: string
  title: string
  type: string
  content: string
  sort: number
}

type SiteContentResponse = {
  rooms: RoomContent[]
  activities: ActivityContent[]
  policies: PolicyContent[]
}

const fallback = {
  rooms: fallbackRooms,
  activities: fallbackActivities,
  policies: stayPolicies.map((content, index) => ({
    id: `fallback-${index}`,
    title: `Policy ${index + 1}`,
    type: 'stay',
    content,
    sort: index
  }))
}

export const useSiteContent = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl as string

  const state = useAsyncData<SiteContentResponse>(
    'site-content',
    async () => {
      const result = await $fetch<SiteContentResponse>(`${apiBaseUrl}/api/site/content`)
      return {
        rooms: result.rooms?.length ? result.rooms : fallback.rooms,
        activities: result.activities?.length ? result.activities : fallback.activities,
        policies: result.policies?.length ? result.policies : fallback.policies
      }
    },
    {
      server: true,
      lazy: false,
      default: () => fallback
    }
  )

  const rooms = computed(() => state.data.value?.rooms ?? fallback.rooms)
  const activities = computed(() => state.data.value?.activities ?? fallback.activities)
  const policies = computed(() => state.data.value?.policies ?? fallback.policies)

  return {
    ...state,
    rooms,
    activities,
    policies
  }
}
