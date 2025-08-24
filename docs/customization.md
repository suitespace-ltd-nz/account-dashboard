# Customization Guide

## Color System

The dashboard uses a centralized color system for consistent entity representation.

### Customizing Entity Colors

Edit `lib/entity-colors.ts`:

\`\`\`typescript
export const ENTITY_COLORS = {
  client: {
    icon: "text-blue-600",
    bg: "bg-blue-600 text-white",
    border: "border-blue-600"
  },
  supply: {
    icon: "text-green-600", 
    bg: "bg-green-600 text-white",
    border: "border-green-600"
  }
  // Add your custom colors
}
\`\`\`

### Adding New Entity Types

1. Add color configuration:
\`\`\`typescript
export const ENTITY_COLORS = {
  // existing colors...
  transformer: {
    icon: "text-purple-600",
    bg: "bg-purple-600 text-white", 
    border: "border-purple-600"
  }
}
\`\`\`

2. Add icon mapping:
\`\`\`typescript
export const getEntityIcon = (type: string, size: string = "md") => {
  switch (type.toLowerCase()) {
    case "transformer":
      return <Zap className={`${sizeClass} text-purple-600`} />
    // other cases...
  }
}
\`\`\`

## Icons

### Using Custom Icons

Replace icons in the business view configuration:

\`\`\`typescript
import { CustomIcon } from '@/components/icons/custom-icon'

const businessViews = [
  {
    id: 'operations',
    name: 'Operations',
    icon: CustomIcon,  // Your custom icon
    views: [...]
  }
]
\`\`\`

### Icon Library

The dashboard uses Lucide React icons by default. To add new icons:

\`\`\`bash
npm install lucide-react
\`\`\`

\`\`\`typescript
import { ViewIcon as NewIcon } from 'lucide-react'
\`\`\`

## Layout Customization

### Responsive Breakpoints

Customize responsive behavior in components:

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Your content */}
</div>
\`\`\`

### Custom Spacing

Modify spacing using Tailwind classes:

\`\`\`tsx
<div className="space-y-6 p-8">  {/* Increased spacing */}
  {/* Content */}
</div>
\`\`\`

## Business Views

### Adding New Business Views

1. Define the view configuration:
\`\`\`typescript
const customView: BusinessView = {
  id: 'maintenance',
  name: 'Maintenance',
  icon: Wrench,
  views: [
    {
      id: 'scheduled-maintenance',
      name: 'Scheduled maintenance tasks',
      icon: Calendar,
      entityType: 'maintenance-tasks'
    }
  ]
}
\`\`\`

2. Add to your business views array:
\`\`\`typescript
export const businessViews = [
  ...existingViews,
  customView
]
\`\`\`

### Custom Filtering

Add custom filter logic:

\`\`\`typescript
const customFilter = (data: any[], filterBy: string) => {
  switch (filterBy) {
    case 'high-priority':
      return data.filter(item => item.priority === 'high')
    case 'overdue':
      return data.filter(item => new Date(item.dueDate) < new Date())
    default:
      return data
  }
}
