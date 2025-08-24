# Getting Started

## Installation

1. Clone or download this project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Basic Usage

### 1. Define Your Data Models

Create TypeScript interfaces for your energy data:

\`\`\`typescript
// lib/types.ts
export interface Supply {
  id: string
  name: string
  icpNumber: string
  fuelType: string
  status: string
  linesCompany: string
}

export interface Client {
  id: string
  name: string
  shortCode: string
  type: string
  status: string
  generalContactEmail: string
}
\`\`\`

### 2. Set Up Your API Client

Configure your data fetching in `lib/api.ts`:

\`\`\`typescript
export const fetchSupplies = async (): Promise<Supply[]> => {
  // Your API implementation
  const response = await fetch('/api/supplies')
  return response.json()
}
\`\`\`

### 3. Create Your Dashboard

Use the provided components to build your dashboard:

\`\`\`tsx
import { BusinessViewDashboard } from '@/components/dashboard/business-view-dashboard'
import { businessViews } from '@/lib/business-views'

export default function Dashboard() {
  return (
    <BusinessViewDashboard 
      views={businessViews}
      title="Your Energy Dashboard"
    />
  )
}
\`\`\`

## Next Steps

- [Component Guide](./components.md) - Learn about available components
- [Data Models](./data-models.md) - Understand the data structure
- [Customization](./customization.md) - Customize colors, icons, and layouts
