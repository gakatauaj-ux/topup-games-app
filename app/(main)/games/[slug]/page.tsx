import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import GameDetailClient from "./client"
import { unstable_noStore } from "next/cache"

export const dynamic = "force-dynamic"

interface GamePageProps {
  params: {
    slug: string
  }
}

async function getGameData(slug: string) {
  unstable_noStore()
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      products: {
        where: { isActive: true },
        include: {
          variants: {
            where: { isActive: true },
            orderBy: { price: "asc" },
          },
        },
      },
    },
  })

  if (!category) {
    return null
  }

  return category
}

export default async function GamePage({ params }: GamePageProps) {
  const category = await getGameData(params.slug)

  if (!category) {
    notFound()
  }

  return <GameDetailClient category={category} />
}
