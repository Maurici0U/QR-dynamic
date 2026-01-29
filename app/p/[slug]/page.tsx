import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Wifi, Share2, AlignLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function PublicQRPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const link = await prisma.link.findUnique({
        where: { slug }
    })

    if (!link) return notFound()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        {link.type === "WIFI" && <Wifi className="h-6 w-6 text-primary" />}
                        {link.type === "SOCIAL" && <Share2 className="h-6 w-6 text-primary" />}
                        {link.type === "TEXT" && <AlignLeft className="h-6 w-6 text-primary" />}
                    </div>
                    <CardTitle>
                        {link.type === "WIFI" && "Conectar a WiFi"}
                        {link.type === "SOCIAL" && "Redes Sociales"}
                        {link.type === "TEXT" && "Nota de Texto"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* WIFI RENDER */}
                    {link.type === "WIFI" && (() => {
                        const data = JSON.parse(link.target)
                        return (
                            <div className="space-y-4 text-center">
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Red (SSID)</p>
                                    <p className="font-bold text-lg">{data.ssid}</p>
                                </div>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Contraseña</p>
                                    <p className="font-mono text-lg">{data.password}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Copia la contraseña y conéctate manualmente si tu dispositivo no lo soporta automáticamente.
                                </p>
                            </div>
                        )
                    })()}

                    {/* SOCIAL RENDER */}
                    {link.type === "SOCIAL" && (() => {
                        const socials = JSON.parse(link.target)
                        return (
                            <div className="grid gap-3">
                                {socials.instagram && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={socials.instagram} target="_blank" rel="noopener noreferrer">
                                            Instagram
                                        </a>
                                    </Button>
                                )}
                                {socials.facebook && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={socials.facebook} target="_blank" rel="noopener noreferrer">
                                            Facebook
                                        </a>
                                    </Button>
                                )}
                                {socials.twitter && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={socials.twitter} target="_blank" rel="noopener noreferrer">
                                            Twitter / X
                                        </a>
                                    </Button>
                                )}
                                {socials.linkedin && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">
                                            LinkedIn
                                        </a>
                                    </Button>
                                )}
                            </div>
                        )
                    })()}

                    {/* TEXT RENDER */}
                    {link.type === "TEXT" && (
                        <div className="bg-muted p-6 rounded-lg whitespace-pre-wrap font-medium text-center">
                            {link.target}
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
