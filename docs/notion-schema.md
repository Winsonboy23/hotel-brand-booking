# Notion Schema (Single Brand)

This project uses Notion as the source of truth for website content and booking records.

## Required Databases

1. `Rooms`
- `Name` (Title)
- `Slug` (Rich text)
- `Subtitle` (Rich text)
- `Description` (Rich text)
- `Size` (Rich text)
- `Occupancy` (Number)
- `Bed Type` (Rich text)
- `Price From` (Number)
- `Cover` (Files)
- `Gallery` (Files)
- `Highlights` (Rich text, newline-separated)
- `Amenities` (Rich text, newline-separated)
- `Is Active` (Checkbox)
- `Sort` (Number)

2. `Activities`
- `Title` (Title)
- `Description` (Rich text)
- `Amount` (Number)
- `Starts At` (Date)
- `Ends At` (Date)
- `Is Active` (Checkbox)
- `Sort` (Number)

3. `Policies`
- `Title` (Title)
- `Type` (Select: stay, cancellation, remittance, notice)
- `Content` (Rich text)
- `Sort` (Number)
- `Is Active` (Checkbox)

4. `Bookings`
- `Booking No` (Title)
- `Status` (Select: pending_remittance, remitted, confirmed, cancelled)
- `Room Slug` (Rich text)
- `Check In` (Date)
- `Check Out` (Date)
- `Nights` (Number)
- `Guests` (Number)
- `Amount` (Number)
- `Guest Name` (Rich text)
- `Email` (Email)
- `Phone` (Phone)
- `Line User ID` (Rich text)
- `Payment Method` (Select: bank_transfer, onsite_card_hold)
- `Remittance Note` (Rich text)
- `Created At` (Date)

## Environment Variables

- `NOTION_API_KEY`
- `NOTION_PARENT_PAGE_ID` (for bootstrap script)
- `NOTION_ROOMS_DB_ID`
- `NOTION_ACTIVITIES_DB_ID`
- `NOTION_POLICIES_DB_ID`
- `NOTION_BOOKINGS_DB_ID`
