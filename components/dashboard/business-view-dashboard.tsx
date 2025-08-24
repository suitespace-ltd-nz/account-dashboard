"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table/data-table"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export interface BusinessView {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  views: SubView[]
}

export interface SubView {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  entityType: string
  groupBy?: string
}

interface BusinessViewDashboardProps {
  views: BusinessView[]
  title: string
  defaultView?: string
  apiClient: {
    [key: string]: () => Promise<any[]>
  }
}

export function BusinessViewDashboard({
  views,
  title,
  defaultView = views[0]?.id,
  apiClient,
}: BusinessViewDashboardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeBusinessView, setActiveBusinessView] = useState(defaultView)
  const [activeSubView, setActiveSubView] = useState(views[0]?.views[0]?.id || "")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const view = searchParams.get("view")
    const subView = searchParams.get("subView")

    if (view && views.find((v) => v.id === view)) {
      setActiveBusinessView(view)
    }
    if (subView) {
      setActiveSubView(subView)
    }
  }, [searchParams, views])

  useEffect(() => {
    const loadData = async () => {
      const currentView = views.find((v) => v.id === activeBusinessView)?.views.find((sv) => sv.id === activeSubView)

      if (!currentView) return

      setLoading(true)
      try {
        const fetchFunction = apiClient[currentView.entityType]
        if (fetchFunction) {
          const result = await fetchFunction()
          setData(result)
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [activeBusinessView, activeSubView, apiClient, views])

  const handleBusinessViewChange = (viewId: string) => {
    setActiveBusinessView(viewId)
    const newView = views.find((v) => v.id === viewId)
    if (newView?.views[0]) {
      setActiveSubView(newView.views[0].id)
    }

    const params = new URLSearchParams(searchParams)
    params.set("view", viewId)
    if (newView?.views[0]) {
      params.set("subView", newView.views[0].id)
    }
    router.push(`?${params.toString()}`)
  }

  const handleSubViewChange = (subViewId: string) => {
    setActiveSubView(subViewId)

    const params = new URLSearchParams(searchParams)
    params.set("subView", subViewId)
    router.push(`?${params.toString()}`)
  }

  const currentBusinessView = views.find((v) => v.id === activeBusinessView)
  const currentSubView = currentBusinessView?.views.find((sv) => sv.id === activeSubView)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader title={title} />

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeBusinessView} onValueChange={handleBusinessViewChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            {views.map((view) => {
              const Icon = view.icon
              return (
                <TabsTrigger key={view.id} value={view.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{view.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {views.map((businessView) => (
            <TabsContent key={businessView.id} value={businessView.id} className="space-y-6">
              <Tabs value={activeSubView} onValueChange={handleSubViewChange}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  {businessView.views.map((view) => {
                    const Icon = view.icon
                    return (
                      <TabsTrigger key={view.id} value={view.id} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {view.name.startsWith("Full list of")
                            ? view.name
                                .replace("Full list of ", "")
                                .split(" ")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")
                            : view.name.split(" ").slice(0, 3).join(" ")}
                        </span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {businessView.views.map((view) => (
                  <TabsContent key={view.id} value={view.id}>
                    <DataTable
                      data={data}
                      loading={loading}
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      filterBy={filterBy}
                      onFilterChange={setFilterBy}
                      groupBy={view.groupBy}
                      entityType={view.entityType}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
