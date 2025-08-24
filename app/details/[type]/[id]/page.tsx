"use client"

import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Users, Zap, Store, FolderOpen, FileText, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EntityDetailsPage() {
  const { user, apiClient } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [entity, setEntity] = useState<any>(null)
  const [relatedData, setRelatedData] = useState<any>({})
  const [loading, setLoading] = useState(true)

  const entityType = params.type as string
  const entityId = params.id as string

  useEffect(() => {
    if (user && apiClient && entityType && entityId) {
      loadEntityDetails()
    }
  }, [user, apiClient, entityType, entityId])

  const loadEntityDetails = async () => {
    setLoading(true)
    try {
      console.log("[v0] Loading entity details for type:", entityType, "id:", entityId)

      // Load the main entity
      const entities = await apiClient.getEntities(getApiEntityType(entityType))
      console.log("[v0] Fetched entities:", entities.length, "entities of type:", getApiEntityType(entityType))
      console.log(
        "[v0] First few entity IDs:",
        entities.slice(0, 5).map((e: any) => ({ id: e.id, type: typeof e.id })),
      )

      const foundEntity = entities.find((e: any) => String(e.id) === String(entityId))
      console.log("[v0] Found entity:", foundEntity ? "YES" : "NO")

      if (foundEntity) {
        console.log("[v0] Entity found:", foundEntity.name || foundEntity.icpNumber || foundEntity.id)
        setEntity(foundEntity)

        // Load related data based on entity type
        const related: any = {}

        if (entityType === "client") {
          // Load sites and ICPs for this client
          const [sites, supplies] = await Promise.all([
            apiClient.getEntities("sites"),
            apiClient.getEntities("supplies"),
          ])
          related.sites = sites.filter((s: any) => s.clientId === entityId)
          related.supplies = supplies.filter((s: any) => related.sites.some((site: any) => site.id === s.siteId))
        } else if (entityType === "icp" || entityType === "supply") {
          // Load site, client, meters for this ICP
          const [sites, clients, meters] = await Promise.all([
            apiClient.getEntities("sites"),
            apiClient.getEntities("clients"),
            apiClient.getEntities("meters"),
          ])
          const site = sites.find((s: any) => s.id === foundEntity.siteId)
          if (site) {
            related.site = site
            related.client = clients.find((c: any) => c.id === site.clientId)
          }
          related.meters = meters.filter((m: any) => m.siteId === foundEntity.siteId)
        } else if (entityType === "retailer") {
          // Load account groups and accounts for this retailer
          const [accountGroups, accounts] = await Promise.all([
            apiClient.getEntities("account-groups"),
            apiClient.getEntities("accounts"),
          ])
          related.accountGroups = accountGroups.filter((ag: any) => ag.retailerId === entityId)
          related.accounts = accounts.filter((a: any) =>
            related.accountGroups.some((ag: any) => ag.id === a.accountGroupId),
          )
        } else if (entityType === "account-group") {
          // Load retailer and accounts for this account group
          const [retailers, accounts] = await Promise.all([
            apiClient.getEntities("retailers"),
            apiClient.getEntities("accounts"),
          ])
          related.retailer = retailers.find((r: any) => r.id === foundEntity.retailerId)
          related.accounts = accounts.filter((a: any) => a.accountGroupId === entityId)
        }

        setRelatedData(related)
      }
    } catch (error) {
      console.error("[v0] Error loading entity details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getApiEntityType = (type: string) => {
    switch (type) {
      case "icp":
        return "supplies"
      case "supply":
        return "supplies"
      case "client":
        return "clients"
      case "retailer":
        return "retailers"
      case "account-group":
        return "account-groups"
      default:
        return type
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "client":
        return Users
      case "icp":
      case "supply":
        return Zap
      case "retailer":
        return Store
      case "account-group":
        return FolderOpen
      default:
        return FileText
    }
  }

  const formatEntityType = (type: string) => {
    switch (type) {
      case "icp":
      case "supply":
        return "ICP"
      case "client":
        return "Client"
      case "retailer":
        return "Retailer"
      case "account-group":
        return "Account Group"
      default:
        return type
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Entity Not Found</h1>
            <p className="text-muted-foreground">The requested entity could not be found.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  const Icon = getEntityIcon(entityType)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">
                  {entity.name || entity.icpNumber || `${formatEntityType(entityType)} ${entity.id}`}
                </h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{formatEntityType(entityType)}</Badge>
                  {entity.status && (
                    <Badge variant={entity.status === "Active" ? "default" : "secondary"}>{entity.status}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              {Object.keys(relatedData).length > 0 && <TabsTrigger value="related">Related</TabsTrigger>}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {entity.id && (
                      <div className="flex justify-between">
                        <span className="font-medium">ID:</span>
                        <span className="text-muted-foreground">{entity.id}</span>
                      </div>
                    )}
                    {entity.name && (
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span className="text-muted-foreground">{entity.name}</span>
                      </div>
                    )}
                    {entity.icpNumber && (
                      <div className="flex justify-between">
                        <span className="font-medium">ICP Number:</span>
                        <span className="text-muted-foreground">{entity.icpNumber}</span>
                      </div>
                    )}
                    {entity.shortCode && (
                      <div className="flex justify-between">
                        <span className="font-medium">Short Code:</span>
                        <span className="text-muted-foreground">{entity.shortCode}</span>
                      </div>
                    )}
                    {entity.type && (
                      <div className="flex justify-between">
                        <span className="font-medium">Type:</span>
                        <span className="text-muted-foreground">{entity.type}</span>
                      </div>
                    )}
                    {entity.status && (
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge variant={entity.status === "Active" ? "default" : "secondary"}>{entity.status}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Contact/Location Information */}
                {(entity.address || entity.phone || entity.email || entity.fuelType || entity.linesCompany) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        {entity.address ? "Contact & Location" : "Technical Details"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {entity.address && (
                        <div className="flex justify-between">
                          <span className="font-medium">Address:</span>
                          <span className="text-muted-foreground text-right">{entity.address}</span>
                        </div>
                      )}
                      {entity.phone && (
                        <div className="flex justify-between">
                          <span className="font-medium">Phone:</span>
                          <span className="text-muted-foreground">{entity.phone}</span>
                        </div>
                      )}
                      {entity.email && (
                        <div className="flex justify-between">
                          <span className="font-medium">Email:</span>
                          <span className="text-muted-foreground">{entity.email}</span>
                        </div>
                      )}
                      {entity.fuelType && (
                        <div className="flex justify-between">
                          <span className="font-medium">Fuel Type:</span>
                          <Badge variant="outline">{entity.fuelType}</Badge>
                        </div>
                      )}
                      {entity.linesCompany && (
                        <div className="flex justify-between">
                          <span className="font-medium">Lines Company:</span>
                          <span className="text-muted-foreground">{entity.linesCompany}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {Object.entries(entity).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                        <span className="text-muted-foreground text-right max-w-md">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {Object.keys(relatedData).length > 0 && (
              <TabsContent value="related" className="space-y-4">
                {Object.entries(relatedData).map(([key, data]) => {
                  if (!data) return null
                  const items = Array.isArray(data) ? data : [data]
                  if (items.length === 0) return null

                  return (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {items.map((item: any, index: number) => (
                            <div key={item.id || index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{item.name || item.icpNumber || `Item ${item.id}`}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {item.type && `Type: ${item.type}`}
                                    {item.fuelType && ` • Fuel: ${item.fuelType}`}
                                    {item.status && ` • Status: ${item.status}`}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const relatedType = key === "supplies" ? "icp" : key.slice(0, -1) // Remove 's' from plural
                                    router.push(`/details/${relatedType}/${item.id}`)
                                  }}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
