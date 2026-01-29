import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateSlug(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let slug = "";
    for (let i = 0; i < length; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { type = "FILE", target, fileId, design } = body;

        // Validation
        if (!type || !target) {
            // Backward compatibility
            if (fileId && !target) {
                // Infer FILE
            } else if (["VCARD", "URL", "WIFI", "SOCIAL", "TEXT"].includes(type)) {
                if (!target) return new NextResponse("Missing target for this type", { status: 400 });
            } else {
                return new NextResponse("Missing type or target", { status: 400 });
            }
        }

        let finalTarget = target;
        if (type === "FILE" && fileId && !target) {
            const file = await prisma.file.findUnique({ where: { id: fileId } });
            if (file) finalTarget = file.path;
            else return new NextResponse("File not found", { status: 404 });
        }

        let slug = generateSlug();
        let unique = false;
        let attempts = 0;
        while (!unique && attempts < 10) {
            const existing = await prisma.link.findUnique({ where: { slug } });
            if (!existing) unique = true;
            else {
                slug = generateSlug();
                attempts++;
            }
        }

        if (!unique) return new NextResponse("Could not generate unique slug", { status: 500 });

        const link = await prisma.link.create({
            data: {
                userId: session.user.id,
                fileId: fileId || undefined,
                slug,
                type,
                target: finalTarget || "",
                design: design ? JSON.stringify(design) : "{}"
            },
            include: {
                file: true
            }
        });

        return NextResponse.json(link);
    } catch (err) {
        console.error(err);
        return new NextResponse("Error creating link", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

        const { linkId, fileId, type, target, design } = await req.json();
        if (!linkId) return new NextResponse("Missing linkId", { status: 400 });

        const link = await prisma.link.findUnique({ where: { id: linkId } });
        if (!link || link.userId !== session.user.id) {
            return new NextResponse("Not found or forbidden", { status: 403 });
        }

        const dataToUpdate: any = {};
        if (type) dataToUpdate.type = type;
        if (target) dataToUpdate.target = target;
        if (design) dataToUpdate.design = typeof design === 'string' ? design : JSON.stringify(design);
        if (fileId !== undefined) dataToUpdate.fileId = fileId;

        if (type === "FILE" && fileId) {
            const file = await prisma.file.findUnique({ where: { id: fileId } });
            if (file) dataToUpdate.target = file.path;
        }

        const updated = await prisma.link.update({
            where: { id: linkId },
            data: dataToUpdate,
            include: { file: true }
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return new NextResponse("Error updating link", { status: 500 });
    }
}
