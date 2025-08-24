"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"
import { FilterSelect } from "@/components/filters/filter-select"
import { EntityCard } from "@/components/dashboard/entity-card"
import { GroupedDataSection } from "./grouped-data-section"

interface DataTableProps {
  data: any[]
  loading: boolean
  searchTerm: string
  onSearchChange: (term: string) => void
  filterBy: string
  onFilterChange: (filter: string) => void
  groupBy?: string
  entityType: string
}

export function DataTable({
  data,
  loading,
  searchTerm,
  onSearchChange,
  filterBy,
  onFilterChange,
  groupBy,
  entityType,
}: DataTableProps) {
  const filteredData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply dropdown filter
    if (filterBy !== "all") {
      filtered = filtered.filter((item) => {
        switch (filterBy) {
          case "active":
            return item.status === "active"
          case "inactive":
            return item.status === "inactive"
          case "electricity":
            return item.fuelType === "Electricity"
          case "gas":
            return item.fuelType === "Gas"
          case "solar":
            return item.fuelType === "Solar"
          default:
            return true
        }
      })
    }

    return filtered
  }, [data, searchTerm, filterBy])

  const groupedData = useMemo(() => {
    if (!groupBy) return null

    const groups: { [key: string]: any[] } = {}
    filteredData.forEach((item) => {
      const groupKey = item[groupBy] || "Unknown"
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(item)
    })

    return groups
  }, [filteredData, groupBy])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
            {groupBy && ` by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`}
          </CardTitle>

          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 max-w-sm"
                disabled={loading}
              />
            </div>

            <FilterSelect
              data={data}
              value={filterBy}
              onChange={onFilterChange}
              entityType={entityType}
              disabled={loading}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">{data.length === 0 ? "No data available" : "No results found"}</p>
          </div>
        ) : groupedData ? (
          <div className="space-y-6">
            {Object.entries(groupedData).map(([groupName, items]) => (
              <GroupedDataSection key={groupName} title={groupName} items={items} entityType={entityType} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((item) => (
              <EntityCard key={item.id} entity={item} entityType={entityType} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
