"use client"

import React from "react"

import { useState, useMemo } from "react"
import {
  ChevronRight,
  ChevronDown,
  Building2,
  MapPin,
  Zap,
  Gauge,
  Radio,
  Users,
  FileText,
  CreditCard,
  Receipt,
  Search,
  X,
  FolderOpen,
  Store,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface EntityNode {
  id: number
  name: string
  type: string
  children?: EntityNode[]
  metadata?: Record<string, any>
  status?: string
  count?: number
}

interface EntityTreeProps {
  data: EntityNode[]
  onNodeSelect: (node: EntityNode) => void
  selectedNode?: EntityNode
  className?: string
}

const getEntityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "client":
      return <Users className="h-6 w-6" />
    case "site":
      return <MapPin className="h-6 w-6" />
    case "supply":
      return <Zap className="h-6 w-6" />
    case "meter":
      return <Gauge className="h-6 w-6" />
    case "channel":
      return <Radio className="h-6 w-6" />
    case "account":
      return <CreditCard className="h-6 w-6" />
    case "accountgroup":
      return <FolderOpen className="h-6 w-6" />
    case "retailer":
      return <Store className="h-6 w-6" />
    case "contract":
      return <FileText className="h-6 w-6" />
    case "invoice":
      return <Receipt className="h-6 w-6" />
    case "statement":
      return <FileText className="h-6 w-6" />
    case "item":
      return <Package className="h-6 w-6" />
    case "section":
      return <Building2 className="h-6 w-6" />
    default:
      return <Building2 className="h-6 w-6" />
  }
}

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-600 text-white"
    case "inactive":
      return "bg-muted text-muted-foreground"
    case "pending":
      return "bg-chart-3 text-white"
    case "error":
      return "bg-destructive text-destructive-foreground"
    default:
      return "bg-primary text-primary-foreground"
  }
}

const TreeNode: React.FC<{
  node: EntityNode
  level: number
  onSelect: (node: EntityNode) => void
  selectedNode?: EntityNode
  expandedNodes: Set<string>
  onToggle: (nodeKey: string) => void
  globalExpandState: "expand" | "collapse" | null
}> = ({ node, level, onSelect, selectedNode, expandedNodes, onToggle, globalExpandState }) => {
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedNode?.id === node.id && selectedNode?.type === node.type
  const nodeKey = `${node.type}-${node.id}`

  // Simple expansion logic: use global state if active, otherwise use individual state
  const isExpanded =
    globalExpandState === "expand" ? true : globalExpandState === "collapse" ? false : expandedNodes.has(nodeKey)

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors hover:bg-sidebar-primary ${
          isSelected ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          // Don't select section nodes, just toggle them
          if (node.type !== "section") {
            onSelect(node)
          }
          if (hasChildren) {
            onToggle(nodeKey)
          }
        }}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(nodeKey)
            }}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        ) : (
          <div className="w-4" />
        )}

        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="h-6 w-6 flex items-center justify-center flex-shrink-0">
            {React.cloneElement(getEntityIcon(node.type), { className: "h-6 w-6" })}
          </span>
          <span className="font-medium truncate">{node.name}</span>
          {node.count !== undefined && (
            <Badge variant="secondary" className="text-xs">
              {node.count}
            </Badge>
          )}
          {node.status && <Badge className={`text-xs ${getStatusColor(node.status)}`}>{node.status}</Badge>}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children!.map((child, index) => (
            <TreeNode
              key={`${child.type}-${child.id}-${index}`}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedNode={selectedNode}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              globalExpandState={globalExpandState}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const EntityTree: React.FC<EntityTreeProps> = ({ data, onNodeSelect, selectedNode, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Auto-expand section nodes by default
    const initialExpanded = new Set<string>()
    data.forEach((node) => {
      if (node.type === "section") {
        initialExpanded.add(`${node.type}-${node.id}`)
      }
    })
    return initialExpanded
  })
  const [globalExpandState, setGlobalExpandState] = useState<"expand" | "collapse" | null>(null)

  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeKey)) {
        newSet.delete(nodeKey)
      } else {
        newSet.add(nodeKey)
      }
      return newSet
    })
    // Clear global state when user manually toggles
    setGlobalExpandState(null)
  }

  const toggleAllNodes = () => {
    if (globalExpandState === "expand") {
      setGlobalExpandState("collapse")
    } else {
      setGlobalExpandState("expand")
    }
  }

  const filteredData = useMemo(() => {
    if (!searchTerm) return data

    const filterNodes = (nodes: EntityNode[]): EntityNode[] => {
      return nodes.reduce((acc: EntityNode[], node) => {
        const matchesSearch =
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.type.toLowerCase().includes(searchTerm.toLowerCase())

        const filteredChildren = node.children ? filterNodes(node.children) : []

        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          })
        }

        return acc
      }, [])
    }

    return filterNodes(data)
  }, [data, searchTerm])

  return (
    <div className={`h-full ${className}`}>
      <div className="px-3 py-1 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 pr-8 h-6 text-xs"
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
          <span>{filteredData.length} items</span>
          <Button variant="ghost" size="sm" onClick={toggleAllNodes} className="text-xs h-4 px-1">
            {globalExpandState === "expand" ? "Collapse All" : "Expand All"}
          </Button>
        </div>
      </div>
      <div className="p-2">
        <div
          className="space-y-1 overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          style={{ maxHeight: "400px" }}
        >
          {filteredData.map((node, index) => (
            <TreeNode
              key={`${node.type}-${node.id}-${index}`}
              node={node}
              level={0}
              onSelect={onNodeSelect}
              selectedNode={selectedNode}
              expandedNodes={expandedNodes}
              onToggle={toggleNode}
              globalExpandState={globalExpandState}
            />
          ))}
          {filteredData.length === 0 && searchTerm && (
            <div className="text-center text-muted-foreground py-8">No entities found matching "{searchTerm}"</div>
          )}
        </div>
      </div>
    </div>
  )
}
