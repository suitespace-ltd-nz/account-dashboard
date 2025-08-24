# Component Guide

## Core Components

### BusinessViewDashboard

The main dashboard component that provides tabbed business views.

\`\`\`tsx
<BusinessViewDashboard 
  views={businessViews}
  title="Energy Operations Hub"
  defaultView="kep"
/>
\`\`\`

**Props:**
- `views`: Array of business view configurations
- `title`: Dashboard title
- `defaultView`: Initial view to display

### DataTable

Advanced data table with filtering, search, and grouping.

\`\`\`tsx
<DataTable
  data={supplies}
  columns={columns}
  searchable={true}
  filterable={true}
  groupBy="retailer"
/>
\`\`\`

**Props:**
- `data`: Array of data objects
- `columns`: Column configuration
- `searchable`: Enable search functionality
- `filterable`: Enable filtering
- `groupBy`: Field to group data by

### FilterSelect

Dynamic filter dropdown that adapts to data.

\`\`\`tsx
<FilterSelect
  data={supplies}
  value={filterBy}
  onChange={setFilterBy}
  filterKey="fuelType"
/>
\`\`\`

### EntityCard

Displays entity information in card format.

\`\`\`tsx
<EntityCard
  entity={supply}
  onViewDetails={handleViewDetails}
  showStatus={true}
/>
\`\`\`

## Layout Components

### DashboardHeader

Standard header with navigation and branding.

\`\`\`tsx
<DashboardHeader title="Energy Dashboard" />
\`\`\`

### BusinessViewTabs

Tabbed interface for different business perspectives.

\`\`\`tsx
<BusinessViewTabs
  views={views}
  activeView={activeView}
  onViewChange={setActiveView}
/>
\`\`\`

## Utility Components

### StatusBadge

Displays status with appropriate colors.

\`\`\`tsx
<StatusBadge status="active" />
\`\`\`

### EntityIcon

Shows appropriate icon for entity type.

\`\`\`tsx
<EntityIcon type="supply" size="sm" />
