"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { ArrowLeft, Save, Palette, Link as LinkIcon, FileText, User, Wifi, Share2, AlignLeft } from "lucide-react"
import Link from "next/link"
import { WifiForm } from "@/components/qr-forms/wifi-form"
import { SocialForm } from "@/components/qr-forms/social-form"
import { TextForm } from "@/components/qr-forms/text-form"
import { VCardForm } from "@/components/qr-forms/vcard-form"
import { UrlForm } from "@/components/qr-forms/url-form"
import { QRFrame } from "@/components/qr-frames/qr-frame"
import { QR_FRAMES } from "@/components/qr-frames/definitions"

export default function CreateQRPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Core Data
    const [type, setType] = useState("FILE") // FILE, URL, VCARD, WIFI, SOCIAL, TEXT
    const [target, setTarget] = useState("")
    const [fileId, setFileId] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    // Design Data
    const [fgColor, setFgColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [frame, setFrame] = useState("none")

    // VCard Data
    const [vcard, setVcard] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        website: ""
    })

    // Wifi Data
    const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" })

    // Text Data
    const [textData, setTextData] = useState("")

    // Social Data
    const [socials, setSocials] = useState({ instagram: "", facebook: "", twitter: "", linkedin: "" })

    const handleFileUpload = (id: string, name: string) => {
        setFileId(id)
        setFileName(name)
        setTarget("https://example.com/file-preview")
    }

    const generateVCardString = () => {
        return `BEGIN:VCARD
VERSION:3.0
N:${vcard.lastName};${vcard.firstName};;;
FN:${vcard.firstName} ${vcard.lastName}
TEL:${vcard.phone}
EMAIL:${vcard.email}
URL:${vcard.website}
END:VCARD`
    }

    const getPreviewValue = () => {
        if (type === "FILE") return fileId ? "https://example.com/file" : "https://example.com"
        if (type === "URL") return target || "https://example.com"
        if (type === "VCARD") return generateVCardString()
        if (type === "WIFI") return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};;`
        if (type === "TEXT") return textData || "Texto de ejemplo"
        if (type === "SOCIAL") return "https://example.com/social-preview"
        return "https://example.com"
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            let finalTarget = target
            if (type === "VCARD") finalTarget = generateVCardString()
            if (type === "WIFI") finalTarget = JSON.stringify(wifi)
            if (type === "TEXT") finalTarget = textData
            if (type === "SOCIAL") finalTarget = JSON.stringify(socials)

            const res = await fetch("/api/link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    target: finalTarget,
                    fileId: type === "FILE" ? fileId : undefined,
                    design: { fgColor, bgColor, frame }
                })
            })

            if (!res.ok) throw new Error("Error creating QR")

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Error al guardar el QR")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)]">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Crear Nuevo QR</h1>
                </div>
                <Button onClick={handleSave} disabled={loading || (type === "FILE" && !fileId)}>
                    {loading ? "Guardando..." : "Guardar QR"}
                    <Save className="ml-2 h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                {/* Left Panel: Configuration */}
                <div className="lg:col-span-7 space-y-6 overflow-y-auto pb-20">
                    <Tabs defaultValue="type" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="type">1. Elige el Tipo</TabsTrigger>
                            <TabsTrigger value="design">2. Personaliza Diseño</TabsTrigger>
                        </TabsList>

                        <TabsContent value="type" className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setType("FILE")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${type === "FILE" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                                >
                                    <FileText className="h-8 w-8 mb-2" />
                                    <span className="font-medium">Archivo</span>
                                </button>
                                <button
                                    onClick={() => setType("URL")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${type === "URL" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                                >
                                    <LinkIcon className="h-8 w-8 mb-2" />
                                    <span className="font-medium">Sitio Web</span>
                                </button>
                                <button
                                    onClick={() => setType("VCARD")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${type === "VCARD" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                                >
                                    <User className="h-8 w-8 mb-2" />
                                    <span className="font-medium">VCard</span>
                                </button>
                                <button
                                    onClick={() => setType("WIFI")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${type === "WIFI" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                                >
                                    <Wifi className="h-8 w-8 mb-2" />
                                    <span className="font-medium">WiFi</span>
                                </button>
                                <button
                                    onClick={() => setType("SOCIAL")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${type === "SOCIAL" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                                >
                                    <Share2 className="h-8 w-8 mb-2" />
                                    <span className="font-medium">Social</span>
                                </button>
                                <button
                                    onClick={() => setType("TEXT")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${type === "TEXT" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
                                >
                                    <AlignLeft className="h-8 w-8 mb-2" />
                                    <span className="font-medium">Texto</span>
                                </button>
                            </div>

                            <Card>
                                <CardContent className="pt-6">
                                    {type === "FILE" && (
                                        <div className="space-y-4">
                                            <Label>Sube tu archivo (PDF, Imágenes)</Label>
                                            <FileUpload onUploadSuccess={handleFileUpload} />
                                            {fileName && (
                                                <p className="text-sm text-green-600">Archivo seleccionado: {fileName}</p>
                                            )}
                                        </div>
                                    )}

                                    {type === "URL" && (
                                        <UrlForm data={target} onChange={setTarget} />
                                    )}

                                    {type === "VCARD" && (
                                        <VCardForm data={vcard} onChange={setVcard} />
                                    )}

                                    {type === "WIFI" && (
                                        <WifiForm data={wifi} onChange={setWifi} />
                                    )}

                                    {type === "TEXT" && (
                                        <TextForm data={textData} onChange={setTextData} />
                                    )}

                                    {type === "SOCIAL" && (
                                        <SocialForm data={socials} onChange={setSocials} />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="design" className="space-y-6">
                            <Card>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Palette className="h-5 w-5" />
                                            <h3 className="font-semibold text-lg">Personalización</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Elige un Marco</Label>
                                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                                {Object.values(QR_FRAMES).map((f) => (
                                                    <div
                                                        key={f.id}
                                                        className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-muted/50 transition-all ${frame === f.id ? "border-primary bg-muted/20" : "border-border/50"}`}
                                                        onClick={() => setFrame(f.id)}
                                                    >
                                                        <div className="w-full aspect-square flex items-center justify-center bg-gray-50/80 rounded border text-gray-400">
                                                            {f.id === "none" ? (
                                                                <div className="w-8 h-8 bg-gray-300 rounded-sm" />
                                                            ) : (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="w-8 h-8 border border-gray-400 rounded-sm" />
                                                                    <span className="text-[9px] mt-1 font-mono uppercase">Marco</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-medium text-center truncate w-full">{f.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                            <div className="space-y-2">
                                                <Label>Color de Puntos (Foreground)</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="color"
                                                        className="w-12 h-12 p-1 cursor-pointer"
                                                        value={fgColor}
                                                        onChange={(e) => setFgColor(e.target.value)}
                                                    />
                                                    <Input
                                                        value={fgColor}
                                                        onChange={(e) => setFgColor(e.target.value)}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Color de Fondo (Background)</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="color"
                                                        className="w-12 h-12 p-1 cursor-pointer"
                                                        value={bgColor}
                                                        onChange={(e) => setBgColor(e.target.value)}
                                                    />
                                                    <Input
                                                        value={bgColor}
                                                        onChange={(e) => setBgColor(e.target.value)}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Panel: Preview */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8">
                        <Card className="border-2 border-primary/20 overflow-hidden">
                            <div className="bg-muted/50 p-4 border-b text-center text-sm font-medium text-muted-foreground">
                                Vista Previa en Vivo
                            </div>
                            <CardContent className="p-8 flex flex-col items-center justify-center bg-white min-h-[400px]">
                                <QRFrame
                                    frameId={frame}
                                    slug="preview"
                                    origin="https://example.com"
                                    design={JSON.stringify({ fgColor, bgColor })}
                                    size={250}
                                />
                                <p className="mt-6 text-sm text-center text-muted-foreground max-w-[200px]">
                                    Así se verá tu código QR una vez generado.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
