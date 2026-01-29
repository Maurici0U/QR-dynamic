import { getServerSession } from "next-auth"
import { headers } from "next/headers"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DashboardView } from "@/components/dashboard-view"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect("/login")
    }

    const links = await prisma.link.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            file: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    // Determine origin for QR codes
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    return (
        <DashboardView initialLinks={links} origin={origin} />
    )
}
