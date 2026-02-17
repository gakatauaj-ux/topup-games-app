import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }

  interface User {
    id: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
  }
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  categoryId: string
  isActive: boolean
  category: Category
  variants: ProductVariant[]
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  products: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
  productId: string
  isActive: boolean
  product: Product
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  totalAmount: number
  status: string
  user: {
    id: string
    name: string | null
    email: string
  }
  items: OrderItem[]
  transaction: Transaction | null
  topupData: TopupData | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productVariantId: string
  quantity: number
  price: number
  productVariant: ProductVariant & {
    product: Product
  }
}

export interface Transaction {
  id: string
  orderId: string
  midtransOrderId: string
  paymentType: string | null
  transactionStatus: string
  grossAmount: number
  paymentToken: string | null
  paidAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface TopupData {
  id: string
  orderId: string
  gameId: string
  serverId: string | null
  username: string | null
  nickname: string | null
  notes: string | null
  createdAt: Date
}
