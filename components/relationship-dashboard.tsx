"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { EntityTree } from "./entity-tree"
import { EntityDetailPanel } from "./entity-detail-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  Users,
  MapPin,
  Zap,
  Gauge,
  Radio,
  RefreshCw,
  Store,
  FolderOpen,
  CreditCard,
  FileText,
  Receipt,
  Package,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getEntityColor } from "@/lib/entity-colors"

interface EntityNode {
  id: number
  name: string
  type: string
  children?: EntityNode[]
  metadata?: Record<string, any>
  status?: string
  count?: number
}

interface RelationshipDashboardProps {
  className?: string
  onNavigate?: (view: string) => void
}

export const RelationshipDashboard: React.FC<RelationshipDashboardProps> = ({ className = "", onNavigate }) => {
  const { user, apiClient } = useAuth()
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [treeData, setTreeData] = useState<EntityNode[]>([])
  const [relationships, setRelationships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState("hierarchy")
  const [rawEntityData, setRawEntityData] = useState<any>({})

  // Load hierarchical data
  const loadHierarchicalData = async () => {
    try {
      setLoading(true)

      const [
        clients,
        sites,
        supplies,
        meters,
        channels,
        retailers,
        accountGroups,
        accounts,
        statements,
        invoices,
        items,
      ] = await Promise.all([
        apiClient.getEntities<any>("clients"),
        apiClient.getEntities<any>("sites"),
        apiClient.getEntities<any>("supplies"),
        apiClient.getEntities<any>("meters"),
        apiClient.getEntities<any>("channels"),
        apiClient.getEntities<any>("retailers"),
        apiClient.getEntities<any>("account-groups"),
        apiClient.getEntities<any>("accounts"),
        apiClient.getEntities<any>("statements"),
        apiClient.getEntities<any>("invoices"),
        apiClient.getEntities<any>("items"),
      ])

      console.log("[v0] API Response counts:", {
        clients: clients?.length || 0,
        sites: sites?.length || 0,
        supplies: supplies?.length || 0,
        meters: meters?.length || 0,
        channels: channels?.length || 0,
        retailers: retailers?.length || 0,
        accountGroups: accountGroups?.length || 0,
        accounts: accounts?.length || 0,
        statements: statements?.length || 0,
        invoices: invoices?.length || 0,
        items: items?.length || 0,
      })

      // Build supply chain hierarchy (down the V)
      const supplyChainData: EntityNode[] = clients.map((client: any) => {
        const clientSites = sites.filter(
          (site: any) => site.ownerId === client.id || site.agentId === client.id || site.tenantId === client.id,
        )

        return {
          id: client.id,
          name: client.name,
          type: "client",
          status: client.status,
          metadata: client,
          count: clientSites.length,
          children: clientSites.map((site: any) => {
            const siteSupplies = supplies.filter((supply: any) => supply.siteId === site.id)

            return {
              id: site.id,
              name: site.name,
              type: "site",
              status: site.status,
              metadata: site,
              count: siteSupplies.length,
              children: siteSupplies.map((supply: any) => {
                const supplyMeters = meters.filter((meter: any) => meter.supplyId === supply.id)

                return {
                  id: supply.id,
                  name: supply.name,
                  type: "supply",
                  status: supply.status,
                  metadata: supply,
                  count: supplyMeters.length,
                  children: supplyMeters.map((meter: any) => {
                    const meterChannels = channels.filter((channel: any) => channel.meterId === meter.id)
                    const meterItems = items.filter((item: any) => item.meterId === meter.id)

                    return {
                      id: meter.id,
                      name: meter.name,
                      type: "meter",
                      status: meter.status,
                      metadata: meter,
                      count: meterChannels.length + meterItems.length,
                      children: [
                        ...meterChannels.map((channel: any) => ({
                          id: channel.id,
                          name: channel.name,
                          type: "channel",
                          status: channel.status,
                          metadata: channel,
                        })),
                        ...meterItems.map((item: any) => ({
                          id: item.id,
                          name: item.name,
                          type: "item",
                          status: item.status,
                          metadata: item,
                        })),
                      ],
                    }
                  }),
                }
              }),
            }
          }),
        }
      })

      const billingData: EntityNode[] = retailers.map((retailer: any) => {
        const retailerAccountGroups = accountGroups.filter((group: any) => group.retailerId === retailer.id)

        return {
          id: retailer.id,
          name: retailer.name,
          type: "retailer",
          status: retailer.status,
          metadata: retailer,
          count: retailerAccountGroups.length,
          children: retailerAccountGroups.map((group: any) => {
            const groupAccounts = accounts.filter((account: any) => account.accountGroupId === group.id)
            const groupStatements = statements.filter((statement: any) => statement.accountGroupId === group.id)

            return {
              id: group.id,
              name: group.name,
              type: "accountGroup",
              status: group.status,
              metadata: group,
              count: groupAccounts.length,
              children: [
                ...groupAccounts.map((account: any) => {
                  const accountInvoices = invoices.filter((invoice: any) => invoice.accountId === account.id)

                  return {
                    id: account.id,
                    name: account.name || `Account #${account.id}`,
                    type: "account",
                    status: account.status,
                    metadata: account,
                    count: accountInvoices.length,
                    children: accountInvoices.map((invoice: any) => ({
                      id: invoice.id,
                      name: invoice.name || `Invoice #${invoice.id}`,
                      type: "invoice",
                      status: invoice.status,
                      metadata: invoice,
                    })),
                  }
                }),
                ...groupStatements.map((statement: any) => ({
                  id: statement.id,
                  name: statement.name || `Statement #${statement.id}`,
                  type: "statement",
                  status: statement.status,
                  metadata: statement,
                })),
              ],
            }
          }),
        }
      })

      const combinedData: EntityNode[] = [
        {
          id: -1,
          name: "Supply Chain",
          type: "section",
          count: supplyChainData.length,
          children: supplyChainData,
        },
        {
          id: -2,
          name: "Billing & Accounts",
          type: "section",
          count: billingData.length,
          children: billingData,
        },
      ]

      setTreeData(combinedData)

      setRawEntityData({
        clients,
        sites,
        supplies,
        meters,
        channels,
        retailers,
        accountGroups,
        accounts,
        statements,
        invoices,
        items,
      })
    } catch (error) {
      console.error("Error loading hierarchical data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Load relationships for selected entity
  const loadRelationships = async (entity: any) => {
    if (!entity) return

    try {
      const relationships = []

      // Based on entity type, load related entities
      switch (entity.type) {
        case "client":
          // Load sites owned/managed by this client
          const clientSites = await apiClient.getEntities<any>("sites")
          const relatedSites = clientSites.filter(
            (site: any) => site.ownerId === entity.id || site.agentId === entity.id || site.tenantId === entity.id,
          )
          if (relatedSites.length > 0) {
            relationships.push({
              type: "sites",
              label: "Associated Sites",
              entities: relatedSites,
            })
          }
          break

        case "site":
          // Load supplies at this site
          const siteSupplies = await apiClient.getEntities<any>("supplies")
          const supplies = siteSupplies.filter((supply: any) => supply.siteId === entity.id)
          if (supplies.length > 0) {
            relationships.push({
              type: "supplies",
              label: "Supplies at Site",
              entities: supplies,
            })
          }
          break

        case "supply":
          // Load meters for this supply
          const supplyMeters = await apiClient.getEntities<any>("meters")
          const meters = supplyMeters.filter((meter: any) => meter.supplyId === entity.id)
          if (meters.length > 0) {
            relationships.push({
              type: "meters",
              label: "Meters",
              entities: meters,
            })
          }
          break

        case "meter":
          // Load channels and components for this meter
          const meterChannels = await apiClient.getEntities<any>("channels")
          const meterItems = await apiClient.getEntities<any>("items")
          const channels = meterChannels.filter((channel: any) => channel.meterId === entity.id)
          const items = meterItems.filter((item: any) => item.meterId === entity.id)
          if (channels.length > 0) {
            relationships.push({
              type: "channels",
              label: "Channels",
              entities: channels,
            })
          }
          if (items.length > 0) {
            relationships.push({
              type: "items",
              label: "Items",
              entities: items,
            })
          }
          break

        case "retailer":
          const retailerGroups = await apiClient.getEntities<any>("account-groups")
          const groups = retailerGroups.filter((group: any) => group.retailerId === entity.id)
          if (groups.length > 0) {
            relationships.push({
              type: "accountGroups",
              label: "Account Groups",
              entities: groups,
            })
          }
          break

        case "accountGroup":
          const groupAccounts = await apiClient.getEntities<any>("accounts")
          const groupStatements = await apiClient.getEntities<any>("statements")
          const accounts = groupAccounts.filter((account: any) => account.accountGroupId === entity.id)
          const statements = groupStatements.filter((statement: any) => statement.accountGroupId === entity.id)
          if (accounts.length > 0) {
            relationships.push({
              type: "accounts",
              label: "Accounts",
              entities: accounts,
            })
          }
          if (statements.length > 0) {
            relationships.push({
              type: "statements",
              label: "Statements",
              entities: statements,
            })
          }
          break

        case "account":
          const accountInvoices = await apiClient.getEntities<any>("invoices")
          const invoices = accountInvoices.filter((invoice: any) => invoice.accountId === entity.id)
          if (invoices.length > 0) {
            relationships.push({
              type: "invoices",
              label: "Invoices",
              entities: invoices,
            })
          }
          break
      }

      setRelationships(relationships)
    } catch (error) {
      console.error("Error loading relationships:", error)
    }
  }

  useEffect(() => {
    if (user) {
      loadHierarchicalData()
    }
  }, [user])

  useEffect(() => {
    if (selectedEntity) {
      loadRelationships(selectedEntity)
    }
  }, [selectedEntity])

  const handleNodeSelect = (node: EntityNode) => {
    setSelectedEntity({
      ...node.metadata,
      type: node.type,
    })
  }

  const handleEdit = (entity: any) => {
    alert(`Edit ${entity.type}: ${entity.name}`)
  }

  const handleDelete = async (entity: any) => {
    if (confirm(`Are you sure you want to delete ${entity.type} "${entity.name}"?`)) {
      try {
        await apiClient.deleteEntity(entity.type + "s", entity.id)
        await loadHierarchicalData()
        setSelectedEntity(null)
      } catch (error) {
        console.error("Error deleting entity:", error)
        alert("Failed to delete entity")
      }
    }
  }

  const getEntityStats = () => {
    const stats = {
      clients: rawEntityData.clients?.length || 0,
      sites: rawEntityData.sites?.length || 0,
      supplies: rawEntityData.supplies?.length || 0,
      retailers: rawEntityData.retailers?.length || 0,
      accountGroups: rawEntityData.accountGroups?.length || 0,
      accounts: rawEntityData.accounts?.length || 0,
      statements: rawEntityData.statements?.length || 0,
      invoices: rawEntityData.invoices?.length || 0,
      // Minor stats
      meters: rawEntityData.meters?.length || 0,
      channels: rawEntityData.channels?.length || 0,
      items: rawEntityData.items?.length || 0,
    }

    console.log("[v0] Calculated stats:", stats)
    return stats
  }

  const stats = getEntityStats()

  const handleStatsClick = (entityType: string) => {
    if (onNavigate) {
      onNavigate(entityType)
    }
  }

  const handleSmallStatsClick = (entityType: string) => {
    alert(
      `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} page is not available yet.\n\nThese are supporting entities that are managed through their parent entities.`,
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-4">
        {/* Major Entity Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Down the V: Clients → Sites → Supplies */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-muted-foreground">Supply Chain</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatsClick("clients")}
              >
                <CardContent className="p-3 text-center">
                  <Users className={`h-6 w-6 mx-auto mb-1 ${getEntityColor("client", "icon")}`} />
                  <div className="text-xl font-bold">{stats.clients}</div>
                  <div className="text-xs text-muted-foreground">Clients</div>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatsClick("sites")}
              >
                <CardContent className="p-3 text-center">
                  <MapPin className={`h-6 w-6 mx-auto mb-1 ${getEntityColor("site", "icon")}`} />
                  <div className="text-xl font-bold">{stats.sites}</div>
                  <div className="text-xs text-muted-foreground">Sites</div>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatsClick("supplies")}
              >
                <CardContent className="p-3 text-center">
                  <Zap className={`h-6 w-6 mx-auto mb-1 ${getEntityColor("supply", "icon")}`} />
                  <div className="text-xl font-bold">{stats.supplies}</div>
                  <div className="text-xs text-muted-foreground">Supplies</div>
                </CardContent>
              </Card>
            </div>
            {/* Small stats underneath */}
            <div className="grid grid-cols-2 gap-2">
              <Card
                className="bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => handleSmallStatsClick("meters")}
              >
                <CardContent className="p-2 text-center">
                  <Gauge className={`h-4 w-4 mx-auto mb-1 ${getEntityColor("meter", "icon")}`} />
                  <div className="text-sm font-semibold">{stats.meters}</div>
                  <div className="text-xs text-muted-foreground">Meters</div>
                </CardContent>
              </Card>
              <Card
                className="bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => handleSmallStatsClick("channels")}
              >
                <CardContent className="p-2 text-center">
                  <Radio className={`h-4 w-4 mx-auto mb-1 ${getEntityColor("channel", "icon")}`} />
                  <div className="text-sm font-semibold">{stats.channels}</div>
                  <div className="text-xs text-muted-foreground">Channels</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Up the V: Retailers → Account Groups → Accounts */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-muted-foreground">Billing & Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatsClick("retailers")}
              >
                <CardContent className="p-3 text-center">
                  <Store className={`h-6 w-6 mx-auto mb-1 ${getEntityColor("retailer", "icon")}`} />
                  <div className="text-xl font-bold">{stats.retailers}</div>
                  <div className="text-xs text-muted-foreground">Retailers</div>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatsClick("accountgroups")}
              >
                <CardContent className="p-3 text-center">
                  <FolderOpen className={`h-6 w-6 mx-auto mb-1 ${getEntityColor("accountgroup", "icon")}`} />
                  <div className="text-xl font-bold">{stats.accountGroups}</div>
                  <div className="text-xs text-muted-foreground">Account Groups</div>
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStatsClick("accounts")}
              >
                <CardContent className="p-3 text-center">
                  <CreditCard className={`h-6 w-6 mx-auto mb-1 ${getEntityColor("account", "icon")}`} />
                  <div className="text-xl font-bold">{stats.accounts}</div>
                  <div className="text-xs text-muted-foreground">Accounts</div>
                </CardContent>
              </Card>
            </div>
            {/* Small stats underneath */}
            <div className="grid grid-cols-3 gap-2">
              <Card
                className="bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => handleStatsClick("statements")}
              >
                <CardContent className="p-2 text-center">
                  <FileText className={`h-4 w-4 mx-auto mb-1 ${getEntityColor("statement", "icon")}`} />
                  <div className="text-sm font-semibold">{stats.statements}</div>
                  <div className="text-xs text-muted-foreground">Statements</div>
                </CardContent>
              </Card>
              <Card
                className="bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => handleStatsClick("invoices")}
              >
                <CardContent className="p-2 text-center">
                  <Receipt className={`h-4 w-4 mx-auto mb-1 ${getEntityColor("invoice", "icon")}`} />
                  <div className="text-sm font-semibold">{stats.invoices}</div>
                  <div className="text-xs text-muted-foreground">Invoices</div>
                </CardContent>
              </Card>
              <Card
                className="bg-muted/30 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => handleSmallStatsClick("components")}
              >
                <CardContent className="p-2 text-center">
                  <Package className={`h-4 w-4 mx-auto mb-1 ${getEntityColor("component", "icon")}`} />
                  <div className="text-sm font-semibold">{stats.items}</div>
                  <div className="text-xs text-muted-foreground">Components</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 min-h-[500px]">
        {/* Entity Tree */}
        <div className="xl:col-span-2">
          <Card className="h-full gap-0">
            <CardHeader className="pb-1 pt-1 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-1 text-xs font-medium">
                  <span className="h-6 w-6 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6" />
                  </span>
                  Entity Hierarchy
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-40px)]">
              <EntityTree
                data={treeData}
                onNodeSelect={handleNodeSelect}
                selectedNode={selectedEntity}
                className="border-0 h-full"
              />
            </CardContent>
          </Card>
        </div>

        {/* Entity Details */}
        <div className="xl:col-span-3">
          <EntityDetailPanel
            entity={selectedEntity}
            relationships={relationships}
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
