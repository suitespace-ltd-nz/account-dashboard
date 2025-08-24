"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EntityDetailPanel } from "./entity-detail-panel"
import { RefreshCw, Search, X, Plus, Download } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface EntityListViewProps {
  entityType: string
  title: string
  icon: any
  columns: Array<{ key: string; label: string; sortable?: boolean }>
  className?: string
  onNavigate?: (entityType: string, entityId?: string) => void
  selectedEntityId?: string | null
}

export const EntityListView: React.FC<EntityListViewProps> = ({
  entityType,
  title,
  icon,
  columns,
  className = "",
  onNavigate,
  selectedEntityId,
}) => {
  const { user, apiClient } = useAuth()
  const [entities, setEntities] = useState<any[]>([])
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [relationships, setRelationships] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    if (user && apiClient) {
      fetchData()
    }
  }, [user, apiClient, entityType])

  useEffect(() => {
    if (selectedEntity) {
      loadRelationships(selectedEntity)
    }
  }, [selectedEntity])

  useEffect(() => {
    if (selectedEntityId && entities.length > 0) {
      const entity = entities.find((e) => e.id.toString() === selectedEntityId)
      if (entity) {
        setSelectedEntity({
          ...entity,
          type: entityType.slice(0, -1), // Remove 's' from plural
        })
      }
    } else if (!selectedEntityId) {
      setSelectedEntity(null)
    }
  }, [selectedEntityId, entities, entityType])

  const filteredEntities = useMemo(() => {
    if (!searchTerm) return entities

    return entities.filter((entity) =>
      Object.values(entity).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [entities, searchTerm])

  const sortedEntities = useMemo(() => {
    if (!sortColumn) return filteredEntities

    return [...filteredEntities].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]
      const direction = sortDirection === "asc" ? 1 : -1
      return aVal < bVal ? -direction : aVal > bVal ? direction : 0
    })
  }, [filteredEntities, sortColumn, sortDirection])

  const fetchData = async () => {
    if (!apiClient) return

    setLoading(true)
    setError(null)

    try {
      console.log(`[v0] Fetching ${entityType} data`)
      const data = await apiClient.getEntities<any>(entityType)
      setEntities(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(`[v0] Error fetching ${entityType}:`, err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      setEntities([])
    } finally {
      setLoading(false)
    }
  }

  const loadRelationships = async (entity: any) => {
    if (!entity || !apiClient) return

    try {
      const relationships = []

      switch (entityType) {
        case "clients":
          const sites = await apiClient.getEntities<any>("sites")
          const relatedSites = sites.filter(
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

        case "sites":
          const supplies = await apiClient.getEntities<any>("supplies")
          const siteSupplies = supplies.filter((supply: any) => supply.siteId === entity.id)
          if (siteSupplies.length > 0) {
            relationships.push({
              type: "supplies",
              label: "Supplies at Site",
              entities: siteSupplies,
            })
          }
          break

        case "supplies":
          const meters = await apiClient.getEntities<any>("meters")
          const supplyMeters = meters.filter((meter: any) => meter.supplyId === entity.id)
          if (supplyMeters.length > 0) {
            relationships.push({
              type: "meters",
              label: "Meters",
              entities: supplyMeters,
            })
          }
          break

        case "retailers":
          const accountGroups = await apiClient.getEntities<any>("account-groups")
          const retailerGroups = accountGroups.filter((group: any) => group.retailerId === entity.id)
          if (retailerGroups.length > 0) {
            relationships.push({
              type: "accountGroups",
              label: "Account Groups",
              entities: retailerGroups,
            })
          }
          break

        case "account-groups":
          const accounts = await apiClient.getEntities<any>("accounts")
          const statements = await apiClient.getEntities<any>("statements")
          const groupAccounts = accounts.filter((account: any) => account.accountGroupId === entity.id)
          const groupStatements = statements.filter((statement: any) => statement.accountGroupId === entity.id)

          if (groupAccounts.length > 0) {
            relationships.push({
              type: "accounts",
              label: "Accounts",
              entities: groupAccounts,
            })
          }
          if (groupStatements.length > 0) {
            relationships.push({
              type: "statements",
              label: "Statements",
              entities: groupStatements,
            })
          }
          break

        case "accounts":
          const invoices = await apiClient.getEntities<any>("invoices")
          const accountInvoices = invoices.filter((invoice: any) => invoice.accountId === entity.id)
          if (accountInvoices.length > 0) {
            relationships.push({
              type: "invoices",
              label: "Invoices",
              entities: accountInvoices,
            })
          }
          break

        case "statements":
          const statementAccounts = await apiClient.getEntities<any>("accounts")
          const relatedAccounts = statementAccounts.filter(
            (account: any) => account.accountGroupId === entity.accountGroupId,
          )
          if (relatedAccounts.length > 0) {
            relationships.push({
              type: "accounts",
              label: "Related Accounts",
              entities: relatedAccounts,
            })
          }
          break

        case "invoices":
          const invoiceAccounts = await apiClient.getEntities<any>("accounts")
          const relatedAccount = invoiceAccounts.find((account: any) => account.id === entity.accountId)
          if (relatedAccount) {
            relationships.push({
              type: "accounts",
              label: "Account",
              entities: [relatedAccount],
            })
          }
          break

        case "meters":
          const channels = await apiClient.getEntities<any>("channels")
          const meterChannels = channels.filter((channel: any) => channel.meterId === entity.id)
          if (meterChannels.length > 0) {
            relationships.push({
              type: "channels",
              label: "Channels",
              entities: meterChannels,
            })
          }
          break
      }

      setRelationships(relationships)
    } catch (error) {
      console.error("Error loading relationships:", error)
    }
  }

  const handleEdit = async (item: any) => {
    console.log(`[v0] Edit ${entityType}:`, item)
    alert(
      `Edit ${entityType.slice(0, -1)}: ${item.name || item.id}\n\nEdit functionality will be implemented in the next phase.`,
    )
  }

  const handleDelete = async (item: any) => {
    if (!apiClient) return

    const confirmed = window.confirm(
      `Are you sure you want to delete ${entityType.slice(0, -1)} "${item.name || item.id}"?\n\nThis action cannot be undone.`,
    )

    if (!confirmed) return

    try {
      console.log(`[v0] Deleting ${entityType}:`, item)
      await apiClient.deleteEntity(entityType, item.id)
      await fetchData()
      if (selectedEntity?.id === item.id) {
        setSelectedEntity(null)
      }
      alert(`${entityType.slice(0, -1)} deleted successfully!`)
    } catch (err) {
      console.error(`[v0] Error deleting ${entityType}:`, err)
      alert(`Failed to delete ${entityType.slice(0, -1)}: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  const handleAdd = async () => {
    console.log(`[v0] Add new ${entityType}`)
    alert(`Add new ${entityType.slice(0, -1)}\n\nAdd functionality will be implemented in the next phase.`)
  }

  const handleExport = async () => {
    console.log(`[v0] Export ${entityType}:`, entities)

    if (entities.length === 0) {
      alert("No data to export")
      return
    }

    const headers = Object.keys(entities[0])
    const csvContent = [
      headers.join(","),
      ...entities.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${entityType}-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleRowClick = (item: any) => {
    const entityWithType = {
      ...item,
      type: entityType.slice(0, -1), // Remove 's' from plural
    }
    setSelectedEntity(entityWithType)

    if (onNavigate) {
      onNavigate(entityType, item.id.toString())
    }
  }

  const handleEntityEdit = (entity: any) => {
    alert(`Edit ${entity.type}: ${entity.name}`)
  }

  const handleEntityDelete = async (entity: any) => {
    if (confirm(`Are you sure you want to delete ${entity.type} "${entity.name}"?`)) {
      try {
        await apiClient.deleteEntity(entity.type + "s", entity.id)
        await fetchData()
        setSelectedEntity(null)
      } catch (error) {
        console.error("Error deleting entity:", error)
        alert("Failed to delete entity")
      }
    }
  }

  const handleNavigateToEntity = (relatedEntity: any) => {
    console.log(`[v0] Navigating to related entity:`, relatedEntity)

    if (onNavigate && relatedEntity.type) {
      // Map entity types to their corresponding page routes
      const entityTypeMap: { [key: string]: string } = {
        client: "clients",
        site: "sites",
        supply: "supplies",
        meter: "meters",
        channel: "channels",
        item: "items",
        retailer: "retailers",
        accountGroup: "account-groups",
        account: "accounts",
        statement: "statements",
        invoice: "invoices",
      }

      const pageRoute = entityTypeMap[relatedEntity.type] || relatedEntity.type + "s"
      onNavigate(pageRoute, relatedEntity.id.toString())
    } else {
      // Fallback to updating details panel if no navigation function provided
      setSelectedEntity({
        ...relatedEntity,
        type: relatedEntity.type || entityType.slice(0, -1),
      })
      // Load relationships for the newly selected entity
      loadRelationships(relatedEntity)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const renderCellValue = (value: any) => {
    if (typeof value === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
    }
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>
    }
    return String(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            {icon}
            <div className="text-2xl font-bold mt-2">{entities.length}</div>
            <div className="text-xs text-muted-foreground">Total {title}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">
              {entities.filter((e) => e.status === "Active" || e.status === "active").length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">
              {entities.filter((e) => e.status !== "Active" && e.status !== "active").length}
            </div>
            <div className="text-xs text-muted-foreground">Inactive</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Entity List */}
        <div className="xl:col-span-2">
          <Card className="h-[500px] gap-0">
            <CardHeader className="pb-1 pt-1 px-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-1 text-xs font-medium">
                  <span className="h-6 w-6 flex items-center justify-center flex-shrink-0">
                    {React.cloneElement(icon, { className: "h-6 w-6" })}
                  </span>
                  {title}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handleAdd} className="h-5 px-2 text-xs">
                    <Plus className="h-3 w-3 mr-1" />
                    Add New
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleExport} className="h-5 px-2 text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-40px)]">
              <div className="px-3 py-1 border-b bg-muted/20">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-7 pr-8 h-6 text-xs border-0 bg-transparent focus-visible:ring-0"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                  <span>{filteredEntities.length} items</span>
                </div>
              </div>
              <div className="h-[calc(100%-60px)] overflow-hidden">
                <div className="h-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column.key}
                            className={column.sortable ? "cursor-pointer hover:bg-muted/50" : ""}
                            onClick={() => column.sortable && handleSort(column.key)}
                          >
                            <div className="flex items-center space-x-1">
                              <span>{column.label}</span>
                              {column.sortable && sortColumn === column.key && (
                                <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedEntities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={columns.length + 1} className="text-center py-8">
                            No data found
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedEntities.map((item, index) => (
                          <TableRow
                            key={item.id || index}
                            className={`cursor-pointer hover:bg-muted/50 ${
                              selectedEntity?.id === item.id ? "bg-muted" : ""
                            }`}
                            onClick={() => handleRowClick(item)}
                          >
                            {columns.map((column) => (
                              <TableCell key={column.key}>{renderCellValue(item[column.key])}</TableCell>
                            ))}
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(item)
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(item)
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Entity Details */}
        <div className="xl:col-span-3">
          <EntityDetailPanel
            entity={selectedEntity}
            relationships={relationships}
            onEdit={handleEntityEdit}
            onDelete={handleEntityDelete}
            onNavigateToEntity={handleNavigateToEntity}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}
