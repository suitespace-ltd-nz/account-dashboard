"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Edit,
  Trash2,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  FileText,
  Building2,
  Users,
  Zap,
  Gauge,
  Radio,
  Store,
  FolderOpen,
  CreditCard,
  Receipt,
  Package,
  Calendar,
  Hash,
  Activity,
  Link,
  Home,
  Factory,
  Fuel,
  Plug,
} from "lucide-react"
import { getEntityColor } from "@/lib/entity-colors"

interface EntityDetailPanelProps {
  entity: any
  relationships?: Array<{
    type: string
    entities: any[]
    label: string
  }>
  onEdit?: (entity: any) => void
  onDelete?: (entity: any) => void
  onNavigateToEntity?: (entity: any) => void
  className?: string
}

const formatDate = (date: string | Date) => {
  if (!date) return "N/A"
  return new Date(date).toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const formatEntityType = (type: string) => {
  if (!type) return "Entity"

  // Handle specific irregular plurals and API naming
  const typeMap: Record<string, string> = {
    supplie: "Supply",
    supplies: "Supply",
    supply: "Supply",
    clients: "Client",
    client: "Client",
    sites: "Site",
    site: "Site",
    meters: "Meter",
    meter: "Meter",
    channels: "Channel",
    channel: "Channel",
    retailers: "Retailer",
    retailer: "Retailer",
    "account-groups": "Account Group",
    "account-group": "Account Group",
    accountgroups: "Account Group",
    accountgroup: "Account Group",
    "account group": "Account Group",
    account_group: "Account Group",
    account_groups: "Account Group",
    accounts: "Account",
    account: "Account",
    statements: "Statement",
    statement: "Statement",
    invoices: "Invoice",
    invoice: "Invoice",
    items: "Component",
    item: "Component",
    components: "Component",
    component: "Component",
  }

  const lowerType = type.toLowerCase()
  return typeMap[lowerType] || type.charAt(0).toUpperCase() + type.slice(1)
}

const formatAddress = (entity: any) => {
  const parts = [entity.unit, entity.streetNumber, entity.streetName, entity.suburb, entity.city].filter(Boolean)

  return parts.length > 0 ? parts.join(", ") : "No address"
}

const getEntityTypeColor = (type: string) => {
  const normalizedType = type.toLowerCase().replace(/[\s-_]/g, "")
  let colorType = normalizedType

  if (
    normalizedType.includes("accountgroup") ||
    normalizedType === "accountgroups" ||
    normalizedType === "accountgroup"
  ) {
    colorType = "accountgroup"
  }

  const color = getEntityColor(colorType, "bg")

  if (type.toLowerCase().includes("account") && type.toLowerCase().includes("group")) {
    return "bg-orange-600 text-white"
  }

  return color
}

const getEntityIcon = (type: string, size: "sm" | "md" = "sm") => {
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5"
  const normalizedType = type.toLowerCase().replace(/[\s-_]/g, "")

  if (normalizedType.includes("accountgroup") || type.toLowerCase().includes("account group")) {
    return <FolderOpen className={`${sizeClass} ${getEntityColor("accountgroup", "icon")}`} />
  }

  switch (type.toLowerCase()) {
    case "client":
      return <Users className={`${sizeClass} ${getEntityColor("client", "icon")}`} />
    case "site":
      return <MapPin className={`${sizeClass} ${getEntityColor("site", "icon")}`} />
    case "supply":
      return <Zap className={`${sizeClass} ${getEntityColor("supply", "icon")}`} />
    case "meter":
      return <Gauge className={`${sizeClass} ${getEntityColor("meter", "icon")}`} />
    case "channel":
      return <Radio className={`${sizeClass} ${getEntityColor("channel", "icon")}`} />
    case "retailer":
      return <Store className={`${sizeClass} ${getEntityColor("retailer", "icon")}`} />
    case "accountgroup":
      return <FolderOpen className={`${sizeClass} ${getEntityColor("accountgroup", "icon")}`} />
    case "account":
      return <CreditCard className={`${sizeClass} ${getEntityColor("account", "icon")}`} />
    case "statement":
      return <FileText className={`${sizeClass} ${getEntityColor("statement", "icon")}`} />
    case "invoice":
      return <Receipt className={`${sizeClass} ${getEntityColor("invoice", "icon")}`} />
    case "item":
    case "component":
      return <Package className={`${sizeClass} ${getEntityColor("component", "icon")}`} />
    default:
      return <Building2 className={`${sizeClass} text-muted-foreground`} />
  }
}

const getRelationshipIcon = (relationshipType: string) => {
  switch (relationshipType.toLowerCase()) {
    case "parent":
    case "owner":
      return <Building2 className="h-4 w-4 text-blue-500" />
    case "location":
    case "address":
      return <Home className="h-4 w-4 text-green-500" />
    case "billing":
    case "financial":
      return <CreditCard className="h-4 w-4 text-purple-500" />
    case "technical":
    case "infrastructure":
      return <Factory className="h-4 w-4 text-orange-500" />
    case "connection":
    case "link":
      return <Link className="h-4 w-4 text-indigo-500" />
    case "energy":
    case "fuel":
      return <Fuel className="h-4 w-4 text-red-500" />
    case "utility":
    case "service":
      return <Plug className="h-4 w-4 text-yellow-500" />
    default:
      return <Activity className="h-4 w-4 text-muted-foreground" />
  }
}

const deduceEntityRelationships = (entity: any) => {
  const deducedFacts = []

  // Site relationship for supplies
  if (entity.type === "supply" && entity.siteId) {
    deducedFacts.push({
      icon: getRelationshipIcon("location"),
      label: "Located at Site",
      value: `Site ID: ${entity.siteId}`,
      type: "location",
      navigable: true,
      entityType: "site",
      entityId: entity.siteId,
    })
  }

  // Client relationships for sites
  if (entity.type === "site") {
    if (entity.ownerId) {
      deducedFacts.push({
        icon: getRelationshipIcon("owner"),
        label: "Owned by Client",
        value: `Client ID: ${entity.ownerId}`,
        type: "parent",
        navigable: true,
        entityType: "client",
        entityId: entity.ownerId,
      })
    }
    if (entity.agentId && entity.agentId !== entity.ownerId) {
      deducedFacts.push({
        icon: getRelationshipIcon("connection"),
        label: "Managed by Agent",
        value: `Agent ID: ${entity.agentId}`,
        type: "connection",
        navigable: true,
        entityType: "client",
        entityId: entity.agentId,
      })
    }
    if (entity.tenantId && entity.tenantId !== entity.ownerId) {
      deducedFacts.push({
        icon: getRelationshipIcon("connection"),
        label: "Tenant",
        value: `Tenant ID: ${entity.tenantId}`,
        type: "connection",
        navigable: true,
        entityType: "client",
        entityId: entity.tenantId,
      })
    }
  }

  // Supply relationships for meters
  if (entity.type === "meter" && entity.supplyId) {
    deducedFacts.push({
      icon: getRelationshipIcon("connection"),
      label: "Connected to Supply",
      value: `Supply ID: ${entity.supplyId}`,
      type: "connection",
      navigable: true,
      entityType: "supply",
      entityId: entity.supplyId,
    })
  }

  // Meter relationships for channels/items
  if ((entity.type === "channel" || entity.type === "item") && entity.meterId) {
    deducedFacts.push({
      icon: getRelationshipIcon("technical"),
      label: "Meter Connection",
      value: `Meter ID: ${entity.meterId}`,
      type: "technical",
      navigable: true,
      entityType: "meter",
      entityId: entity.meterId,
    })
  }

  // Account Group relationships
  if (entity.type === "account" && entity.accountGroupId) {
    deducedFacts.push({
      icon: getRelationshipIcon("parent"),
      label: "Account Group",
      value: `Group ID: ${entity.accountGroupId}`,
      type: "parent",
      navigable: true,
      entityType: "accountGroup",
      entityId: entity.accountGroupId,
    })
  }

  // Retailer relationships
  if (entity.type === "accountGroup" && entity.retailerId) {
    deducedFacts.push({
      icon: getRelationshipIcon("billing"),
      label: "Retailer",
      value: `Retailer ID: ${entity.retailerId}`,
      type: "billing",
      navigable: true,
      entityType: "retailer",
      entityId: entity.retailerId,
    })
  }

  // Account relationships for invoices/statements
  if (entity.type === "invoice" && entity.accountId) {
    deducedFacts.push({
      icon: getRelationshipIcon("billing"),
      label: "Billed to Account",
      value: `Account ID: ${entity.accountId}`,
      type: "billing",
      navigable: true,
      entityType: "account",
      entityId: entity.accountId,
    })
  }

  if (entity.type === "statement" && entity.accountGroupId) {
    deducedFacts.push({
      icon: getRelationshipIcon("billing"),
      label: "Statement for Group",
      value: `Group ID: ${entity.accountGroupId}`,
      type: "billing",
      navigable: true,
      entityType: "accountGroup",
      entityId: entity.accountGroupId,
    })
  }

  // Technical details with icons
  if (entity.icpNumber) {
    deducedFacts.push({
      icon: getRelationshipIcon("utility"),
      label: "ICP Number",
      value: entity.icpNumber,
      type: "technical",
    })
  }

  if (entity.fuelType) {
    deducedFacts.push({
      icon: getRelationshipIcon("energy"),
      label: "Fuel Type",
      value: entity.fuelType,
      type: "technical",
    })
  }

  if (entity.linesCompany) {
    deducedFacts.push({
      icon: getRelationshipIcon("utility"),
      label: "Lines Company",
      value: entity.linesCompany,
      type: "technical",
    })
  }

  if (entity.meterType) {
    deducedFacts.push({
      icon: getRelationshipIcon("technical"),
      label: "Meter Type",
      value: entity.meterType,
      type: "technical",
    })
  }

  return deducedFacts
}

export const EntityDetailPanel: React.FC<EntityDetailPanelProps> = ({
  entity,
  relationships = [],
  onEdit,
  onDelete,
  onNavigateToEntity,
  className = "",
}) => {
  if (!entity) {
    return (
      <Card className={`h-full ${className}`}>
        <CardContent className="p-8 text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an entity to view details</p>
        </CardContent>
      </Card>
    )
  }

  const entityType = formatEntityType(entity.type)
  const badgeColor = getEntityTypeColor(entityType)

  const deducedFacts = deduceEntityRelationships(entity)

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={badgeColor} variant="default">
                <span className="flex items-center gap-1">
                  {React.cloneElement(getEntityIcon(entityType, "sm"), {
                    className: "h-4 w-4 text-white",
                  })}
                  {entityType}
                </span>
              </Badge>
              {entity.status && <Badge variant="outline">{entity.status}</Badge>}
            </div>
            <CardTitle className="text-xl font-bold">{entity.name}</CardTitle>
            {entity.shortCode && <p className="text-sm text-muted-foreground">Code: {entity.shortCode}</p>}
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(entity)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(entity)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 overflow-auto">
        {deducedFacts.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Entity Connections
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {deducedFacts.map((fact, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border bg-card/50 ${
                    fact.navigable ? "hover:bg-muted/50 cursor-pointer transition-colors" : ""
                  }`}
                  onClick={() =>
                    fact.navigable &&
                    onNavigateToEntity?.({
                      id: fact.entityId,
                      type: fact.entityType,
                      name: fact.value,
                    })
                  }
                >
                  <div className="flex items-center gap-3">
                    {fact.icon}
                    <div>
                      <div className="text-sm font-medium">{fact.label}</div>
                      <div className="text-xs text-muted-foreground">{fact.value}</div>
                    </div>
                  </div>
                  {fact.navigable && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Created:</span>
                <p className="text-muted-foreground">{formatDate(entity.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="font-medium">Updated:</span>
                <p className="text-muted-foreground">{formatDate(entity.updatedAt)}</p>
              </div>
            </div>
            {entity.id && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="font-medium">ID:</span>
                  <p className="text-muted-foreground">{entity.id}</p>
                </div>
              </div>
            )}
            {entity.type && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="font-medium">Type:</span>
                  <p className="text-muted-foreground">{entityType}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        {(entity.streetName || entity.suburb || entity.city) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </h3>
              <p className="text-sm">{formatAddress(entity)}</p>
            </div>
          </>
        )}

        {/* Contact Information */}
        {(entity.generalContactEmail || entity.generalContactNumber || entity.billingEmail) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Contact Information
              </h3>
              <div className="space-y-2 text-sm">
                {entity.generalContactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{entity.generalContactEmail}</span>
                  </div>
                )}
                {entity.generalContactNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{entity.generalContactNumber}</span>
                  </div>
                )}
                {entity.billingEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{entity.billingEmail} (Billing)</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Technical Details */}
        {(entity.icpNumber || entity.fuelType || entity.linesCompany || entity.meterType) && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Technical Details</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                {entity.icpNumber && (
                  <div>
                    <span className="font-medium">ICP Number:</span>
                    <p className="text-muted-foreground">{entity.icpNumber}</p>
                  </div>
                )}
                {entity.fuelType && (
                  <div>
                    <span className="font-medium">Fuel Type:</span>
                    <p className="text-muted-foreground">{entity.fuelType}</p>
                  </div>
                )}
                {entity.linesCompany && (
                  <div>
                    <span className="font-medium">Lines Company:</span>
                    <p className="text-muted-foreground">{entity.linesCompany}</p>
                  </div>
                )}
                {entity.meterType && (
                  <div>
                    <span className="font-medium">Meter Type:</span>
                    <p className="text-muted-foreground">{entity.meterType}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Relationships */}
        {relationships.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Link className="h-4 w-4" />
                Related Entities
              </h3>
              {relationships.map((relationship, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    {getEntityIcon(relationship.type, "sm")}
                    {relationship.label}
                  </h4>
                  <div className="space-y-1">
                    {relationship.entities.slice(0, 5).map((relEntity, relIndex) => (
                      <div
                        key={relIndex}
                        className="flex items-center justify-between p-2 rounded border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => onNavigateToEntity?.(relEntity)}
                      >
                        <div className="flex items-center gap-2">
                          {getEntityIcon(relEntity.type || relationship.type, "sm")}
                          <span className="text-sm">{relEntity.name}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    ))}
                    {relationship.entities.length > 5 && (
                      <p className="text-xs text-muted-foreground">+{relationship.entities.length - 5} more</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Additional Notes */}
        {entity.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entity.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
