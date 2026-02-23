import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    try {
        const link = await prisma.link.findUnique({
            where: { slug },
            include: { file: true }
        });

        if (!link) {
            return new NextResponse("QR Code Not Found", { status: 404 });
        }

        // Increment scan count and record history
        const userAgent = req.headers.get("user-agent") || "Unknown"
        // Simple country guess (Mock for now, would use GeoIP in prod)
        // const country = req.headers.get("x-vercel-ip-country") || "Unknown"

        await prisma.$transaction([
            prisma.link.update({
                where: { id: link.id },
                data: { scans: { increment: 1 } }
            }),
            prisma.scan.create({
                data: {
                    linkId: link.id,
                    userAgent,
                    country: "Unknown"
                }
            })
        ]);

        // Determine destination based on type
        let destination = link.target;

        // If it's a FILE type and target is empty (legacy), try to get from relation
        if (link.type === "FILE" && !destination && link.file) {
            destination = link.file.path;
        }

        if (!destination) {
            // Fallback or error page
            return new NextResponse("No target found for this QR", { status: 404 });
        }

        // Handle URL redirection
        if (link.type === "URL" || link.type === "FILE") {
            // Ensure absolute URL if it's a file path potentially relative? 
            // Actually file paths from Uploadthing are absolute URLs. 
            // Local uploads are /uploads/.., handled by new URL(..., req.url)

            // Check if it's a full URL
            if (destination.startsWith("http")) {
                return NextResponse.redirect(destination);
            } else {
                const url = new URL(destination, req.url);
                return NextResponse.redirect(url);
            }
        }

        // Handle other types (VCARD, TEXT, WIFI)
        // These are not "redirections" in the HTTP sense usually, 
        // they are content served to the user's scanning app.
        // However, standard web QR readers expect a page.
        // If the scanner opens this URL, we should probably display the content 
        // or trigger a download/action.

        // For VCard, we can return text/vcard content type
        if (link.type === "VCARD") {
            return new NextResponse(destination, {
                headers: {
                    "Content-Type": "text/vcard",
                    "Content-Disposition": `attachment; filename="contact.vcf"`
                }
            });
        }

        // For WIFI, SOCIAL, TEXT -> Redirect to public render page
        if (["WIFI", "SOCIAL", "TEXT"].includes(link.type)) {
            const publicUrl = new URL(`/p/${link.slug}`, req.url);
            return NextResponse.redirect(publicUrl);
        }

        // For default/TEXT (legacy), verify if we should just show it
        return new NextResponse(destination);
    } catch (error) {
        console.error("Redirect error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
