# Examples

## Basic Dashboard

The simplest way to get started is with the basic dashboard example:

\`\`\`tsx
import { BusinessViewDashboard } from '@/components/dashboard/business-view-dashboard'
import { energyBusinessViews } from '@/lib/business-views'
import { createApiClient } from '@/lib/api-client'

export default function Dashboard() {
  const apiClient = createApiClient()

  return (
    <BusinessViewDashboard
      views={energyBusinessViews}
      title="Energy Operations Hub"
      apiClient={apiClient}
    />
  )
}
\`\`\`

## Custom Business Views

Create your own business view configuration:

\`\`\`tsx
import { Users, Wrench } from 'lucide-react'
import { BusinessView } from '@/lib/types'

const customViews: BusinessView[] = [
  {
    id: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    views: [
      {
        id: 'scheduled-tasks',
        name: 'Scheduled maintenance tasks',
        icon: Wrench,
        entityType: 'maintenance-tasks'
      }
    ]
  }
]
\`\`\`

## Real API Integration

Replace the mock API client with your real API:

\`\`\`tsx
import { createRealApiClient } from '@/lib/api-client'

const apiClient = createRealApiClient('https://your-api.com/api')
\`\`\`

## Custom Entity Colors

Customize the color scheme for your entities:

\`\`\`tsx
// In lib/entity-colors.ts
export const ENTITY_COLORS = {
  // Add your custom entity colors
  transformer: {
    icon: "text-purple-600",
    bg: "bg-purple-600 text-white",
    chart: "text-purple-600"
  }
}
\`\`\`

## Standalone Components

Use individual components in your own layouts:

\`\`\`tsx
import { DataTable } from '@/components/data-table/data-table'
import { EntityCard } from '@/components/dashboard/entity-card'
import { FilterSelect } from '@/components/filters/filter-select'

function CustomView() {
  return (
    <div>
      <FilterSelect 
        data={supplies}
        value={filter}
        onChange={setFilter}
        entityType="supplies"
      />
      
      <DataTable
        data={filteredData}
        entityType="supplies"
        groupBy="retailer"
      />
    </div>
  )
}
\`\`\`
\`\`\`
\`\`\`

```json file="" isHidden
