import {
  activities as fallbackActivities,
  facilities as fallbackFacilities,
  hotelProfile as fallbackHotelProfile,
  metrics as fallbackMetrics,
  rooms as fallbackRooms,
  stayPolicies
} from '~/data/hotel'

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

type SiteBrandProfile = {
  localName: string
  tagline: string
  subtitle: string
  heroImage: string
}

type SiteFacility = {
  title: string
  description: string
}

type SiteMetric = {
  value: string
  label: string
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

  const noticePolicies = computed(() => policies.value.filter((item) => item.type === 'notice'))

  const brandProfile = computed<SiteBrandProfile>(() => {
    const localName = noticePolicies.value.find((item) => item.title === 'brand.local_name')?.content
    const tagline = noticePolicies.value.find((item) => item.title === 'brand.tagline')?.content
    const subtitle = noticePolicies.value.find((item) => item.title === 'brand.subtitle')?.content
    const heroImage = noticePolicies.value.find((item) => item.title === 'brand.hero_image')?.content

    return {
      localName: localName || fallbackHotelProfile.localName,
      tagline: tagline || fallbackHotelProfile.tagline,
      subtitle: subtitle || '一站式官方前台，快速完成房型瀏覽、費用試算與預約流程。',
      heroImage: heroImage || fallbackHotelProfile.heroImage
    }
  })

  const facilities = computed<SiteFacility[]>(() => {
    const fromNotion = noticePolicies.value
      .filter((item) => item.title.startsWith('facility:'))
      .map((item) => ({
        title: item.title.replace('facility:', '').trim(),
        description: item.content
      }))
      .filter((item) => item.title && item.description)

    return fromNotion.length ? fromNotion : fallbackFacilities
  })

  const metrics = computed<SiteMetric[]>(() => {
    const fromNotion = noticePolicies.value
      .filter((item) => item.title.startsWith('metric:'))
      .map((item) => {
        const label = item.title.replace('metric:', '').trim()
        return {
          label,
          value: item.content.trim()
        }
      })
      .filter((item) => item.label && item.value)

    return fromNotion.length ? fromNotion : fallbackMetrics
  })

  return {
    ...state,
    rooms,
    activities,
    policies,
    brandProfile,
    facilities,
    metrics
  }
}
