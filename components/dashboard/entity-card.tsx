"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { getEntityIcon } from "@/lib/entity-colors"

interface EntityCardProps {
  entity: any
  entityType: string
}

export function EntityCard({ entity, entityType }: EntityCardProps) {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/details/${entityType}/${entity.id}`)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getEntityIcon(entityType, "sm")}
            <h3 className="font-semibold text-sm">{entity.name}</h3>
          </div>
          {entity.status && (
            <Badge variant={entity.status === "active" ? "default" : "secondary"} className="text-xs">
              {entity.status}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {entity.icpNumber && <div>ICP: {entity.icpNumber}</div>}
          {entity.fuelType && <div>Fuel: {entity.fuelType}</div>}
          {entity.shortCode && <div>Code: {entity.shortCode}</div>}
          {entity.type && <div>Type: {entity.type}</div>}
        </div>

        <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent" onClick={handleViewDetails}>
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
