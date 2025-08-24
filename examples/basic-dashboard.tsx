"use client"
import { BusinessViewDashboard } from "@/components/dashboard/business-view-dashboard"
import { energyBusinessViews } from "@/lib/business-views"
import { createApiClient } from "@/lib/api-client"

export default function BasicDashboard() {
  const apiClient = createApiClient()

  return (
    <BusinessViewDashboard
      views={energyBusinessViews}
      title="Energy Operations Hub"
      defaultView="kep"
      apiClient={apiClient}
    />
  )
}
