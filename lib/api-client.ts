import type { ApiClient, Client, Supply, Retailer } from "./types"
import { fetch } from "node-fetch" // Ensure fetch is imported if not available globally

const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    shortCode: "ACME",
    type: "commercial",
    status: "active",
    generalContactEmail: "contact@acme.com",
  },
  {
    id: "2",
    name: "Beta Industries",
    shortCode: "BETA",
    type: "industrial",
    status: "active",
    generalContactEmail: "info@beta.com",
  },
]

const mockSupplies: Supply[] = [
  {
    id: "1",
    name: "Main Office Supply",
    icpNumber: "ICP001",
    fuelType: "Electricity",
    status: "active",
    linesCompany: "PowerCorp",
  },
  { id: "2", name: "Factory Supply", icpNumber: "ICP002", fuelType: "Gas", status: "active", linesCompany: "GasNet" },
  { id: "3", name: "Solar Farm", icpNumber: "ICP003", fuelType: "Solar", status: "active", linesCompany: "GreenGrid" },
]

const mockRetailers: Retailer[] = [
  { id: "1", name: "Energy Plus", shortCode: "EP", status: "active" },
  { id: "2", name: "Power Solutions", shortCode: "PS", status: "active" },
]

export const createApiClient = (baseUrl?: string): ApiClient => {
  // In a real implementation, you would use fetch or axios to call your API
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  return {
    clients: async () => {
      await delay(500) // Simulate network delay
      return mockClients
    },

    sites: async () => {
      await delay(500)
      return []
    },

    supplies: async () => {
      await delay(500)
      return mockSupplies
    },

    meters: async () => {
      await delay(500)
      return []
    },

    retailers: async () => {
      await delay(500)
      return mockRetailers
    },

    "account-groups": async () => {
      await delay(500)
      return []
    },

    accounts: async () => {
      await delay(500)
      return []
    },

    statements: async () => {
      await delay(500)
      return []
    },

    invoices: async () => {
      await delay(500)
      return []
    },
  }
}

export const createRealApiClient = (baseUrl: string): ApiClient => {
  const fetchData = async (endpoint: string): Promise<any[]> => {
    const response = await fetch(`${baseUrl}/${endpoint}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`)
    }
    return response.json()
  }

  return {
    clients: () => fetchData("clients"),
    sites: () => fetchData("sites"),
    supplies: () => fetchData("supplies"),
    meters: () => fetchData("meters"),
    retailers: () => fetchData("retailers"),
    "account-groups": () => fetchData("account-groups"),
    accounts: () => fetchData("accounts"),
    statements: () => fetchData("statements"),
    invoices: () => fetchData("invoices"),
  }
}
