import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ linkId: string }> }) {
    const { linkId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const link = await prisma.link.findUnique({
            where: { id: linkId },
            include: {
                scanHistory: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!link || link.userId !== session.user.id) {
            return new NextResponse("Not found or forbidden", { status: 403 });
        }

        // Process data for charts: Group by Date
        const stats: Record<string, number> = {};
        link.scanHistory.forEach(scan => {
            const date = scan.createdAt.toISOString().split('T')[0];
            stats[date] = (stats[date] || 0) + 1;
        });

        const chartData = Object.entries(stats).map(([date, count]) => ({
            date,
            scans: count
        }));

        return NextResponse.json(chartData);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
