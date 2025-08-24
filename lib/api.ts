export interface ApiError {
  errorType: string
  message?: string
}

export interface ApiBaseResponse {
  success: boolean
  error?: string
  description?: string
}

export interface UserTokenResponse extends ApiBaseResponse {
  userToken: string
  temporary: boolean
}

export interface User {
  id: number
  name: string
  email?: string
}

export type ServerEnvironment = "PROD" | "TEST"

export interface Client {
  id: number
  name: string
  shortCode: string
  type: string
  status: string
  generalContactEmail: string
}

export interface Supply {
  id: number
  name: string
  icpNumber: string
  fuelType: string
  status: string
  linesCompany: string
}

export interface Site {
  id: number
  name: string
  address: string
  status: string
  clientId: number
}

export interface Meter {
  id: number
  name: string
  serialNumber: string
  type: string
  status: string
  siteId: number
}

export interface EntityListResponse<T> extends ApiBaseResponse {
  objects: T[]
}

export interface EntityResponse<T> extends ApiBaseResponse {
  object: T
}

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(environment: ServerEnvironment = "PROD") {
    this.baseUrl = environment === "PROD" ? "https://suitespace.co.nz/v1" : "https://test.suitespace.co.nz/v1"
  }

  setToken(token: string) {
    this.token = token
  }

  getToken() {
    return this.token
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    console.log("[v0] API Request URL:", url)
    console.log("[v0] API Request method:", options.method || "GET")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      console.log("[v0] API Error - Status:", response.status)
      console.log("[v0] API Error - URL:", url)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async login(emailAddress: string, password: string): Promise<UserTokenResponse> {
    return this.request<UserTokenResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify({ emailAddress, password }),
    })
  }

  async getUser(): Promise<User> {
    return this.request<User>("/user")
  }

  async getEntities<T>(entityType: string, systemId = 100): Promise<T[]> {
    try {
      const response = await this.request<EntityListResponse<T>>(`/system/${systemId}/${entityType}`)

      // Return the objects array from PrismaObjectsResponse
      if (response && typeof response === "object" && "objects" in response) {
        return Array.isArray(response.objects) ? response.objects : []
      }

      // Fallback to empty array if response structure is unexpected
      console.warn("[v0] Unexpected response structure for getEntities:", response)
      return []
    } catch (error) {
      console.error("[v0] Error in getEntities:", error)
      return []
    }
  }

  async getEntity<T>(entityType: string, id: string, systemId = 100): Promise<T | null> {
    try {
      const response = await this.request<EntityResponse<T>>(`/system/${systemId}/${entityType}/${id}`)

      // Return the object from PrismaObjectResponse
      if (response && typeof response === "object" && "object" in response) {
        return response.object || null
      }

      // Fallback for unexpected response structure
      console.warn("[v0] Unexpected response structure for getEntity:", response)
      return null
    } catch (error) {
      console.error("[v0] Error in getEntity:", error)
      return null
    }
  }

  async createEntity<T>(entityType: string, data: Partial<T>, systemId = 100): Promise<T> {
    return this.request<T>(`/system/${systemId}/${entityType}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateEntity<T>(entityType: string, id: string, data: Partial<T>, systemId = 100): Promise<T> {
    return this.request<T>(`/system/${systemId}/${entityType}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteEntity(entityType: string, id: string, systemId = 100): Promise<void> {
    console.log(`[v0] Deleting ${entityType} with ID ${id} from system ${systemId}`)
    return this.request<void>(`/system/${systemId}/${entityType}/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
