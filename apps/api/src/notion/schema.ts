export type NotionDatabaseSpec = {
  title: string
  properties: Record<string, unknown>
}

export const ROOMS_DB_SPEC: NotionDatabaseSpec = {
  title: 'Rooms',
  properties: {
    Name: { title: {} },
    Slug: { rich_text: {} },
    Subtitle: { rich_text: {} },
    Description: { rich_text: {} },
    Size: { rich_text: {} },
    Occupancy: { number: { format: 'number' } },
    'Bed Type': { rich_text: {} },
    'Price From': { number: { format: 'number' } },
    Cover: { files: {} },
    Gallery: { files: {} },
    Highlights: { rich_text: {} },
    Amenities: { rich_text: {} },
    'Is Active': { checkbox: {} },
    Sort: { number: { format: 'number' } }
  }
}

export const ACTIVITIES_DB_SPEC: NotionDatabaseSpec = {
  title: 'Activities',
  properties: {
    Title: { title: {} },
    Description: { rich_text: {} },
    Amount: { number: { format: 'number' } },
    'Starts At': { date: {} },
    'Ends At': { date: {} },
    'Is Active': { checkbox: {} },
    Sort: { number: { format: 'number' } }
  }
}

export const POLICIES_DB_SPEC: NotionDatabaseSpec = {
  title: 'Policies',
  properties: {
    Title: { title: {} },
    Type: {
      select: {
        options: [
          { name: 'stay' },
          { name: 'cancellation' },
          { name: 'remittance' },
          { name: 'notice' }
        ]
      }
    },
    Content: { rich_text: {} },
    Sort: { number: { format: 'number' } },
    'Is Active': { checkbox: {} }
  }
}

export const BOOKINGS_DB_SPEC: NotionDatabaseSpec = {
  title: 'Bookings',
  properties: {
    'Booking No': { title: {} },
    Status: {
      select: {
        options: [
          { name: 'pending_remittance' },
          { name: 'remitted' },
          { name: 'confirmed' },
          { name: 'cancelled' }
        ]
      }
    },
    'Room Slug': { rich_text: {} },
    'Check In': { date: {} },
    'Check Out': { date: {} },
    Nights: { number: { format: 'number' } },
    Guests: { number: { format: 'number' } },
    Amount: { number: { format: 'number' } },
    'Guest Name': { rich_text: {} },
    Email: { email: {} },
    Phone: { phone_number: {} },
    'Line User ID': { rich_text: {} },
    'Payment Method': {
      select: {
        options: [{ name: 'bank_transfer' }, { name: 'onsite_card_hold' }]
      }
    },
    'Remittance Note': { rich_text: {} },
    'Created At': { date: {} }
  }
}

export const REQUIRED_DATABASE_SPECS: NotionDatabaseSpec[] = [
  ROOMS_DB_SPEC,
  ACTIVITIES_DB_SPEC,
  POLICIES_DB_SPEC,
  BOOKINGS_DB_SPEC
]
