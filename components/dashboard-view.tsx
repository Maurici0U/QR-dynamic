"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { FileIcon, RefreshCw, Eye, Link as LinkIcon, User, BarChart2, Wifi, Share2, AlignLeft, Download } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { AnalyticsModal } from "@/components/analytics-modal"
import { EditLinkDialog } from "@/components/edit-link-dialog"
import { QRFrame } from "@/components/qr-frames/qr-frame"

interface LinkWithFile {
    id: string
    slug: string
    file?: {
        id: string
        originalName: string
        mimeType: string
    }
    scans: number
    createdAt: string
    type?: string
    target?: string
    design?: string
}

export function DashboardView({ initialLinks, origin }: { initialLinks: any[], origin: string }) {
    const [links, setLinks] = useState<LinkWithFile[]>(initialLinks)
    const [editingLink, setEditingLink] = useState<string | null>(null)
    const [analyticsLink, setAnalyticsLink] = useState<{ id: string, title: string } | null>(null)

    const linkToEdit = links.find(l => l.id === editingLink)

    const handleEditSuccess = (updatedLink: any) => {
        setLinks(links.map(l => l.id === updatedLink.id ? updatedLink : l))
    }

    // Download logic
    const downloadQR = (slug: string, format: 'svg' | 'png') => {
        const svg = document.getElementById(`qr-${slug}`);
        if (!svg) return;

        if (format === 'svg') {
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svg);
            const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `qr-${slug}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        } else if (format === 'png') {
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svg);
            const img = new Image();
            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                // Scale up
                canvas.width = 1000;
                canvas.height = 1000;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, 1000, 1000);
                const url = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.href = url;
                a.download = `qr-${slug}.png`;
                a.click();
            };
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Mis Archivos QR</h2>
                <Link href="/dashboard/create">
                    <Button>Nuevo QR</Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {links.map((link) => (
                    <Card key={link.id} className="relative overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                {link.file ? (
                                    <FileIcon className="h-5 w-5 text-blue-500" />
                                ) : link.type === "URL" ? (
                                    <LinkIcon className="h-5 w-5 text-green-500" />
                                ) : link.type === "WIFI" ? (
                                    <Wifi className="h-5 w-5 text-indigo-500" />
                                ) : link.type === "SOCIAL" ? (
                                    <Share2 className="h-5 w-5 text-pink-500" />
                                ) : link.type === "VCARD" ? (
                                    <User className="h-5 w-5 text-orange-500" />
                                ) : (
                                    <AlignLeft className="h-5 w-5 text-gray-500" />
                                )}
                                <span className="truncate">
                                    {link.file ? link.file.originalName : (link.target || "Sin contenido")}
                                </span>
                            </CardTitle>
                            <CardDescription>Escaneos: {link.scans}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center pb-2">
                            <div className="rounded-lg bg-white p-4 shadow-sm">
                                <QRFrame
                                    id={`qr-${link.slug}`}
                                    frameId={JSON.parse(link.design || "{}").frame || "none"}
                                    slug={link.slug}
                                    origin={origin}
                                    design={link.design}
                                    size={150}
                                />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">{origin}/q/{link.slug}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-muted/40 p-4">
                            <div className="flex gap-1">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditingLink(link.id)} title="Editar">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => downloadQR(link.slug, 'png')} title="Descargar PNG">
                                    <Download className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Ver">
                                    <a href={`/q/${link.slug}`} target="_blank" rel="noopener noreferrer">
                                        <Eye className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setAnalyticsLink({
                                    id: link.id,
                                    title: link.file?.originalName || link.target || "QR"
                                })} title="Estadísticas">
                                    <BarChart2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {links.length === 0 && (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    <p>No tienes QRs generados aún.</p>
                </div>
            )}

            <AnalyticsModal
                isOpen={!!analyticsLink}
                onClose={() => setAnalyticsLink(null)}
                linkId={analyticsLink?.id || null}
                linkTitle={analyticsLink?.title || ""}
            />

            {linkToEdit && (
                <EditLinkDialog
                    isOpen={!!linkToEdit}
                    onClose={() => setEditingLink(null)}
                    link={linkToEdit}
                    onUpdateSuccess={handleEditSuccess}
                />
            )}
        </div>
    )
}
