import { Users, Wrench, TrendingUp, CreditCard, Zap, FolderOpen } from "lucide-react"
import type { BusinessView } from "./types"

export const energyBusinessViews: BusinessView[] = [
  {
    id: "kep",
    name: "KEP",
    icon: Users,
    views: [
      {
        id: "clients",
        name: "Full list of clients",
        icon: Users,
        entityType: "clients",
      },
      {
        id: "icps-by-client",
        name: "Full list of ICPs by client",
        icon: Zap,
        entityType: "supplies",
        groupBy: "clientId",
      },
      {
        id: "icps-by-contract-end",
        name: "Full list of ICPs by contract end",
        icon: Zap,
        entityType: "supplies",
        groupBy: "contractEndDate",
      },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    icon: Wrench,
    views: [
      {
        id: "icps-by-client-ops",
        name: "Full list of ICPs by client",
        icon: Zap,
        entityType: "supplies",
        groupBy: "clientId",
      },
      {
        id: "icps-by-retailer-ops",
        name: "Full list of ICPs by retailer",
        icon: Zap,
        entityType: "supplies",
        groupBy: "retailerId",
      },
      {
        id: "labels-by-icp",
        name: "Full list of labels by ICP, categorised by labels",
        icon: Zap,
        entityType: "supplies",
        groupBy: "labels",
      },
    ],
  },
  {
    id: "market-intel",
    name: "Market Intel",
    icon: TrendingUp,
    views: [
      {
        id: "icps-by-contract-end-market",
        name: "Full list of ICPs by contract end",
        icon: Zap,
        entityType: "supplies",
        groupBy: "contractEndDate",
      },
      {
        id: "icps-by-contract-type",
        name: "Full list of ICPs by contract type",
        icon: Zap,
        entityType: "supplies",
        groupBy: "contractType",
      },
      {
        id: "icps-by-client-market",
        name: "Full list of ICPs by client",
        icon: Zap,
        entityType: "supplies",
        groupBy: "clientId",
      },
      {
        id: "icps-by-retailer-market",
        name: "Full list of ICPs by retailer",
        icon: Zap,
        entityType: "supplies",
        groupBy: "retailerId",
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    icon: CreditCard,
    views: [
      {
        id: "icps-by-client-billing",
        name: "Full list of ICPs by client",
        icon: Zap,
        entityType: "supplies",
        groupBy: "clientId",
      },
      {
        id: "icps-by-retailer-billing",
        name: "Full list of ICPs by retailer",
        icon: Zap,
        entityType: "supplies",
        groupBy: "retailerId",
      },
      {
        id: "billing-accounts-by-retailer",
        name: "Full list of billing accounts by retailer",
        icon: FolderOpen,
        entityType: "account-groups",
        groupBy: "retailerId",
      },
    ],
  },
]
