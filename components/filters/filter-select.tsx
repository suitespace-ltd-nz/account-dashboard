"use client"

import { useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSelectProps {
  data: any[]
  value: string
  onChange: (value: string) => void
  entityType: string
  disabled?: boolean
}

export function FilterSelect({ data, value, onChange, entityType, disabled }: FilterSelectProps) {
  const filterOptions = useMemo(() => {
    const options = [{ value: "all", label: "All" }]

    // Add status filters
    const statuses = [...new Set(data.map((item) => item.status).filter(Boolean))]
    statuses.forEach((status) => {
      options.push({
        value: status.toLowerCase(),
        label: status.charAt(0).toUpperCase() + status.slice(1),
      })
    })

    // Add fuel type filters for supplies/ICPs
    if (entityType === "supplies") {
      const fuelTypes = [...new Set(data.map((item) => item.fuelType).filter(Boolean))]
      fuelTypes.forEach((fuelType) => {
        options.push({
          value: fuelType.toLowerCase().replace(/\s+/g, "-"),
          label: fuelType,
        })
      })
    }

    // Add client type filters for clients
    if (entityType === "clients") {
      const clientTypes = [...new Set(data.map((item) => item.type).filter(Boolean))]
      clientTypes.forEach((type) => {
        options.push({
          value: type.toLowerCase(),
          label: type.charAt(0).toUpperCase() + type.slice(1),
        })
      })
    }

    return options
  }, [data, entityType])

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by..." />
      </SelectTrigger>
      <SelectContent>
        {filterOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
