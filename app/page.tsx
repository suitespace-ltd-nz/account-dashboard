"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Zap,
  Store,
  FolderOpen,
  Building2,
  TrendingUp,
  Settings,
  Palette,
  Layout,
  Filter,
  Code,
  Eye,
} from "lucide-react"

export default function ComponentShowcase() {
  const [activeCategory, setActiveCategory] = useState("data-display")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)

  const componentCategories = {
    "data-display": {
      name: "Data Display",
      icon: Layout,
      description: "Components for displaying and organizing data",
      components: [
        {
          id: "entity-card",
          name: "Entity Card",
          description: "Card component for displaying entity information with status badges",
          preview: "EntityCardPreview",
          code: `<Card className="hover:shadow-md transition-shadow">
  <CardContent className="p-4">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Eden Crescent Supply</h4>
          <Badge variant="default">Active</Badge>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>ICP: 0156506270LCE95</p>
          <p>Fuel Type: Solar</p>
          <p>Lines Company: Vector Limited</p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        View Details
      </Button>
    </div>
  </CardContent>
</Card>`,
        },
        {
          id: "grouped-data-section",
          name: "Grouped Data Section",
          description: "Section component for displaying grouped data with headers",
          preview: "GroupedDataPreview",
          code: `<div className="space-y-3">
  <div className="border-b pb-2">
    <h3 className="text-lg font-semibold text-foreground">Vector Limited</h3>
    <p className="text-sm text-muted-foreground">12 items</p>
  </div>
  <div className="grid gap-3 pl-4">
    {/* Entity cards go here */}
  </div>
</div>`,
        },
        {
          id: "business-view-tabs",
          name: "Business View Tabs",
          description: "Tab navigation for different business perspectives",
          preview: "BusinessViewTabsPreview",
          code: `<nav className="flex space-x-8 py-4 overflow-x-auto">
  <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">
    <Building2 className="h-4 w-4" />
    KEP
  </button>
  <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
    <Settings className="h-4 w-4" />
    Operations
  </button>
</nav>`,
        },
      ],
    },
    filters: {
      name: "Filters & Search",
      icon: Filter,
      description: "Components for filtering and searching data",
      components: [
        {
          id: "filter-select",
          name: "Filter Select",
          description: "Dropdown filter with dynamic options based on data",
          preview: "FilterSelectPreview",
          code: `<Select value={filterBy} onValueChange={setFilterBy}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Filter by..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="electricity">Electricity</SelectItem>
    <SelectItem value="solar">Solar</SelectItem>
    <SelectItem value="gas">Gas</SelectItem>
  </SelectContent>
</Select>`,
        },
        {
          id: "search-input",
          name: "Search Input",
          description: "Search input with real-time filtering",
          preview: "SearchInputPreview",
          code: `<Input
  placeholder="Search entities..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="max-w-sm"
/>`,
        },
      ],
    },
    colors: {
      name: "Color System",
      icon: Palette,
      description: "Consistent color system for entity types",
      components: [
        {
          id: "entity-colors",
          name: "Entity Colors",
          description: "Color mapping for different entity types",
          preview: "EntityColorsPreview",
          code: `const ENTITY_COLORS = {
  client: { bg: "bg-blue-600", text: "text-blue-600", icon: "text-blue-600" },
  supply: { bg: "bg-green-600", text: "text-green-600", icon: "text-green-600" },
  retailer: { bg: "bg-red-600", text: "text-red-600", icon: "text-red-600" },
  "account-group": { bg: "bg-orange-600", text: "text-orange-600", icon: "text-orange-600" }
}`,
        },
        {
          id: "status-badges",
          name: "Status Badges",
          description: "Consistent badge styling for status indicators",
          preview: "StatusBadgesPreview",
          code: `<Badge variant="default">Active</Badge>
<Badge variant="secondary">Inactive</Badge>
<Badge variant="outline">Pending</Badge>`,
        },
      ],
    },
    icons: {
      name: "Icon System",
      icon: Eye,
      description: "Consistent icon usage for entity types",
      components: [
        {
          id: "entity-icons",
          name: "Entity Icons",
          description: "Icon mapping for different entity types",
          preview: "EntityIconsPreview",
          code: `const getEntityIcon = (type: string) => {
  switch (type) {
    case "client": return <Users className="h-4 w-4" />
    case "supply": return <Zap className="h-4 w-4" />
    case "retailer": return <Store className="h-4 w-4" />
    case "account-group": return <FolderOpen className="h-4 w-4" />
    default: return <FileText className="h-4 w-4" />
  }
}`,
        },
      ],
    },
  }

  const filteredComponents = Object.entries(componentCategories).reduce(
    (acc, [key, category]) => {
      const filtered = category.components.filter(
        (component) =>
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (filtered.length > 0) {
        acc[key] = { ...category, components: filtered }
      }
      return acc
    },
    {} as typeof componentCategories,
  )

  const renderComponentPreview = (componentId: string) => {
    switch (componentId) {
      case "entity-card":
        return (
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Eden Crescent Supply</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>ICP: 0156506270LCE95</p>
                    <p>Fuel Type: Solar</p>
                    <p>Lines Company: Vector Limited</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case "grouped-data-section":
        return (
          <div className="space-y-3">
            <div className="border-b pb-2">
              <h3 className="text-lg font-semibold text-foreground">Vector Limited</h3>
              <p className="text-sm text-muted-foreground">12 items</p>
            </div>
            <div className="grid gap-3 pl-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Sample Supply 1</h4>
                      <p className="text-xs text-muted-foreground">ICP: 0156506270LCE95</p>
                    </div>
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "business-view-tabs":
        return (
          <nav className="flex space-x-4 py-4 overflow-x-auto">
            <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">
              <Building2 className="h-4 w-4" />
              KEP
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              <Settings className="h-4 w-4" />
              Operations
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">
              <TrendingUp className="h-4 w-4" />
              Market Intel
            </button>
          </nav>
        )

      case "filter-select":
        return (
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="solar">Solar</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
            </SelectContent>
          </Select>
        )

      case "search-input":
        return <Input placeholder="Search entities..." className="max-w-sm" />

      case "entity-colors":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-sm">Client</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span className="text-sm">Supply</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded"></div>
              <span className="text-sm">Retailer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span className="text-sm">Account Group</span>
            </div>
          </div>
        )

      case "status-badges":
        return (
          <div className="flex gap-2">
            <Badge variant="default">Active</Badge>
            <Badge variant="secondary">Inactive</Badge>
            <Badge variant="outline">Pending</Badge>
          </div>
        )

      case "entity-icons":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Client</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm">Supply</span>
            </div>
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-red-600" />
              <span className="text-sm">Retailer</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Account Group</span>
            </div>
          </div>
        )

      default:
        return <div className="p-4 text-center text-muted-foreground">Preview not available</div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Component Library</h1>
                <p className="text-sm text-muted-foreground">Energy Industry Dashboard Components</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <nav className="space-y-2">
                {Object.entries(filteredComponents).map(([key, category]) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeCategory === key
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {filteredComponents[activeCategory] && (
              <>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{filteredComponents[activeCategory].name}</h2>
                  <p className="text-muted-foreground">{filteredComponents[activeCategory].description}</p>
                </div>

                <div className="grid gap-6">
                  {filteredComponents[activeCategory].components.map((component) => (
                    <Card key={component.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{component.name}</CardTitle>
                            <CardDescription>{component.description}</CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedComponent(selectedComponent === component.id ? null : component.id)
                            }
                          >
                            {selectedComponent === component.id ? "Hide Code" : "Show Code"}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Preview</h4>
                          <div className="border rounded-lg p-4 bg-muted/50">
                            {renderComponentPreview(component.id)}
                          </div>
                        </div>

                        {selectedComponent === component.id && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium mb-2">Code</h4>
                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                <code>{component.code}</code>
                              </pre>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
