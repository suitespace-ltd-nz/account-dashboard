import type React from "react"
export interface Supply {
  id: string
  name: string
  icpNumber: string
  fuelType: string
  status: string
  linesCompany: string
}

export interface Client {
  id: string
  name: string
  shortCode: string
  type: string
  status: string
  generalContactEmail: string
}

export interface Site {
  id: string
  name: string
  address: string
  status: string
  clientId: string
}

export interface Meter {
  id: string
  name: string
  serialNumber: string
  type: string
  status: string
  siteId: string
}

export interface Retailer {
  id: string
  name: string
  shortCode: string
  status: string
}

export interface AccountGroup {
  id: string
  name: string
  status: string
  retailerId: string
}

export interface Account {
  id: string
  name: string
  accountNumber: string
  status: string
  accountGroupId: string
}

export interface Statement {
  id: string
  name: string
  statementDate: string
  status: string
  accountId: string
}

export interface Invoice {
  id: string
  name: string
  invoiceDate: string
  amount: number
  status: string
  accountId: string
}

export interface BusinessView {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  views: SubView[]
}

export interface SubView {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  entityType: string
  groupBy?: string
}

export interface ApiClient {
  clients: () => Promise<Client[]>
  sites: () => Promise<Site[]>
  supplies: () => Promise<Supply[]>
  meters: () => Promise<Meter[]>
  retailers: () => Promise<Retailer[]>
  "account-groups": () => Promise<AccountGroup[]>
  accounts: () => Promise<Account[]>
  statements: () => Promise<Statement[]>
  invoices: () => Promise<Invoice[]>
}
