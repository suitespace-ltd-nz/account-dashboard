export const ENTITY_COLORS = {
  // Supply Chain (Down the V)
  client: {
    icon: "text-blue-600",
    bg: "bg-blue-600 text-white",
    chart: "text-chart-1",
  },
  site: {
    icon: "text-green-600",
    bg: "bg-green-600 text-white",
    chart: "text-chart-2",
  },
  supply: {
    icon: "text-yellow-600",
    bg: "bg-yellow-600 text-white",
    chart: "text-chart-3",
  },
  meter: {
    icon: "text-purple-600",
    bg: "bg-purple-600 text-white",
    chart: "text-chart-4",
  },
  channel: {
    icon: "text-orange-600",
    bg: "bg-orange-600 text-white",
    chart: "text-chart-5",
  },

  // Billing & Accounts (Up the V)
  retailer: {
    icon: "text-red-600",
    bg: "bg-red-600 text-white",
    chart: "text-red-600",
  },
  accountgroup: {
    icon: "text-pink-600",
    bg: "bg-pink-600 text-white",
    chart: "text-pink-600",
  },
  account: {
    icon: "text-indigo-600",
    bg: "bg-indigo-600 text-white",
    chart: "text-indigo-600",
  },
  statement: {
    icon: "text-teal-600",
    bg: "bg-teal-600 text-white",
    chart: "text-teal-600",
  },
  invoice: {
    icon: "text-cyan-600",
    bg: "bg-cyan-600 text-white",
    chart: "text-cyan-600",
  },
  item: {
    icon: "text-amber-600",
    bg: "bg-amber-600 text-white",
    chart: "text-amber-600",
  },
  component: {
    icon: "text-amber-600",
    bg: "bg-amber-600 text-white",
    chart: "text-amber-600",
  },
} as const

export const getEntityColor = (entityType: string, colorType: "icon" | "bg" | "chart" = "icon") => {
  const normalizedType = entityType.toLowerCase()
  const colors = ENTITY_COLORS[normalizedType as keyof typeof ENTITY_COLORS]

  if (!colors) {
    return colorType === "bg" ? "bg-gray-600 text-white" : "text-gray-600"
  }

  return colors[colorType]
}

import {
  Users,
  MapPin,
  Zap,
  Gauge,
  Radio,
  Store,
  FolderOpen,
  CreditCard,
  FileText,
  Receipt,
  Package,
  Cpu,
} from "lucide-react"

export const getEntityIcon = (entityType: string, size = "md") => {
  const sizeClass =
    {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    }[size] || "h-5 w-5"

  const colorClass = getEntityColor(entityType, "icon")

  switch (entityType.toLowerCase()) {
    case "client":
    case "clients":
      return <Users className={`${sizeClass} ${colorClass}`} />
    case "site":
    case "sites":
      return <MapPin className={`${sizeClass} ${colorClass}`} />
    case "supply":
    case "supplies":
      return <Zap className={`${sizeClass} ${colorClass}`} />
    case "meter":
    case "meters":
      return <Gauge className={`${sizeClass} ${colorClass}`} />
    case "channel":
    case "channels":
      return <Radio className={`${sizeClass} ${colorClass}`} />
    case "retailer":
    case "retailers":
      return <Store className={`${sizeClass} ${colorClass}`} />
    case "accountgroup":
    case "account-group":
    case "account-groups":
      return <FolderOpen className={`${sizeClass} ${colorClass}`} />
    case "account":
    case "accounts":
      return <CreditCard className={`${sizeClass} ${colorClass}`} />
    case "statement":
    case "statements":
      return <FileText className={`${sizeClass} ${colorClass}`} />
    case "invoice":
    case "invoices":
      return <Receipt className={`${sizeClass} ${colorClass}`} />
    case "item":
    case "items":
      return <Package className={`${sizeClass} ${colorClass}`} />
    case "component":
    case "components":
      return <Cpu className={`${sizeClass} ${colorClass}`} />
    default:
      return <Package className={`${sizeClass} text-gray-600`} />
  }
}
