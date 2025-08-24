"use client"
import { Badge } from "@/components/ui/badge"
import { EntityCard } from "@/components/dashboard/entity-card"

interface GroupedDataSectionProps {
  title: string
  items: any[]
  entityType: string
}

export function GroupedDataSection({ title, items, entityType }: GroupedDataSectionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {items.length} {items.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
        {items.map((item) => (
          <EntityCard key={item.id} entity={item} entityType={entityType} />
        ))}
      </div>
    </div>
  )
}
