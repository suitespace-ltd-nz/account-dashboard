# Data Models

## Core Entities

### Supply (ICP)
Installation Control Points - the primary energy connection entities.

\`\`\`typescript
interface Supply {
  id: string
  name: string
  icpNumber: string        // Unique ICP identifier
  fuelType: string         // "Electricity", "Gas", "Solar", etc.
  status: string           // "active", "inactive", etc.
  linesCompany: string     // Distribution company
}
\`\`\`

### Client
Energy consumers or account holders.

\`\`\`typescript
interface Client {
  id: string
  name: string
  shortCode: string        // Client abbreviation
  type: string            // "residential", "commercial", "industrial"
  status: string
  generalContactEmail: string
}
\`\`\`

### Retailer
Energy retailers/suppliers.

\`\`\`typescript
interface Retailer {
  id: string
  name: string
  shortCode: string
  status: string
}
\`\`\`

### Site
Physical locations where energy is consumed.

\`\`\`typescript
interface Site {
  id: string
  name: string
  address: string
  status: string
  clientId: string        // Reference to Client
}
\`\`\`

### Meter
Physical metering equipment.

\`\`\`typescript
interface Meter {
  id: string
  name: string
  serialNumber: string
  type: string           // "smart", "basic", etc.
  status: string
  siteId: string         // Reference to Site
}
\`\`\`

## Business View Configuration

\`\`\`typescript
interface BusinessView {
  id: string
  name: string
  icon: React.ComponentType
  views: SubView[]
}

interface SubView {
  id: string
  name: string
  icon: React.ComponentType
  entityType: string
  groupBy?: string       // Optional grouping field
}
\`\`\`

## Example Configuration

\`\`\`typescript
export const businessViews: BusinessView[] = [
  {
    id: 'kep',
    name: 'KEP',
    icon: Users,
    views: [
      {
        id: 'clients',
        name: 'Full list of clients',
        icon: Users,
        entityType: 'clients'
      },
      {
        id: 'icps-by-client',
        name: 'Full list of ICPs by client',
        icon: Zap,
        entityType: 'supplies',
        groupBy: 'client'
      }
    ]
  }
]
