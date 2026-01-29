import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, url, size, type } = body;

        if (!name || !url) {
            return new NextResponse("Missing file data", { status: 400 });
        }

        const fileRecord = await prisma.file.create({
            data: {
                userId: session.user.id,
                originalName: name,
                path: url, // Now stores external URL
                mimeType: type || "application/octet-stream",
                size: size || 0,
            },
        });

        return NextResponse.json(fileRecord);
    } catch (error) {
        console.error("Upload record error:", error);
        return new NextResponse("Failed to save file record", { status: 500 });
    }
}
