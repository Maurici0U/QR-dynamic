"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { WifiForm, WifiData } from "@/components/qr-forms/wifi-form"
import { SocialForm, SocialData } from "@/components/qr-forms/social-form"
import { TextForm } from "@/components/qr-forms/text-form"
import { VCardForm, VCardData } from "@/components/qr-forms/vcard-form"
import { UrlForm } from "@/components/qr-forms/url-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QR_FRAMES } from "@/components/qr-frames/definitions"

interface EditLinkDialogProps {
    isOpen: boolean
    onClose: () => void
    link: any
    onUpdateSuccess: (updatedLink: any) => void
}

export function EditLinkDialog({ isOpen, onClose, link, onUpdateSuccess }: EditLinkDialogProps) {
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState("FILE")
    const [target, setTarget] = useState("") // Address URL
    const [fileId, setFileId] = useState<string | null>(null)

    // Design State
    const [fgColor, setFgColor] = useState("#000000")
    const [bgColor, setBgColor] = useState("#ffffff")
    const [frame, setFrame] = useState("none")

    // Form States
    const [vcard, setVcard] = useState<VCardData>({ firstName: "", lastName: "", phone: "", email: "", website: "" })
    const [wifi, setWifi] = useState<WifiData>({ ssid: "", password: "", encryption: "WPA" })
    const [textData, setTextData] = useState("")
    const [socials, setSocials] = useState<SocialData>({ instagram: "", facebook: "", twitter: "", linkedin: "" })

    // Initialize state when link changes
    useEffect(() => {
        if (link) {
            setType(link.type)
            if (link.type === "FILE") {
                setFileId(link.fileId)
            } else if (link.type === "URL") {
                setTarget(link.target)
            } else if (link.type === "TEXT") {
                setTextData(link.target)
            } else if (link.type === "WIFI") {
                try {
                    const parsed = JSON.parse(link.target)
                    setWifi(parsed)
                } catch (e) { console.error("Error parsing WiFi data", e) }
            } else if (link.type === "SOCIAL") {
                try {
                    const parsed = JSON.parse(link.target)
                    setSocials(parsed)
                } catch (e) { console.error("Error parsing Social data", e) }
            }

            // Parse Design
            if (link.design) {
                try {
                    const design = JSON.parse(link.design)
                    if (design.fgColor) setFgColor(design.fgColor)
                    if (design.bgColor) setBgColor(design.bgColor)
                    if (design.frame) setFrame(design.frame)
                } catch (e) { console.error("Error parsing design", e) }
            }
        }
    }, [link])

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

    const handleSave = async () => {
        setLoading(true)
        try {
            let finalTarget = target

            if (type === "VCARD") finalTarget = generateVCardString()
            if (type === "WIFI") finalTarget = JSON.stringify(wifi)
            if (type === "TEXT") finalTarget = textData
            if (type === "SOCIAL") finalTarget = JSON.stringify(socials)

            const res = await fetch("/api/link", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    linkId: link.id,
                    type,
                    target: finalTarget,
                    fileId: type === "FILE" ? fileId : undefined,
                    design: JSON.stringify({ fgColor, bgColor, frame })
                })
            })

            if (res.ok) {
                const updated = await res.json()
                onUpdateSuccess(updated)
                onClose()
            } else {
                alert("Error al actualizar")
            }
        } catch (error) {
            console.error(error)
            alert("Error al actualizar")
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = (id: string, name: string) => {
        setFileId(id)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar QR</DialogTitle>
                    <DialogDescription>
                        Modifica los datos o el diseño de tu código QR.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="content">Contenido</TabsTrigger>
                        <TabsTrigger value="design">Diseño</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4 py-2">
                        {/* Type selection hidden on edit to simplify */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium text-muted-foreground">Tipo actual:</span>
                            <span className="text-sm font-bold px-2 py-1 bg-muted rounded">{type}</span>
                        </div>

                        {type === "FILE" && (
                            <div className="space-y-4">
                                <FileUpload onUploadSuccess={handleFileUpload} label="Subir nuevo archivo" />
                            </div>
                        )}
                        {type === "URL" && <UrlForm data={target} onChange={setTarget} />}
                        {type === "VCARD" && (
                            <div>
                                <p className="text-xs text-amber-600 mb-2">Nota: Al editar VCard, por ahora debes reingresar los datos.</p>
                                <VCardForm data={vcard} onChange={setVcard} />
                            </div>
                        )}
                        {type === "WIFI" && <WifiForm data={wifi} onChange={setWifi} />}
                        {type === "TEXT" && <TextForm data={textData} onChange={setTextData} />}
                        {type === "SOCIAL" && <SocialForm data={socials} onChange={setSocials} />}
                    </TabsContent>

                    <TabsContent value="design" className="space-y-6 py-2">
                        <div className="space-y-3">
                            <Label>Elige un Marco</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {Object.values(QR_FRAMES).map((f) => (
                                    <div
                                        key={f.id}
                                        className={`cursor-pointer border-2 rounded-lg p-3 flex flex-col items-center gap-2 hover:bg-muted/50 transition-all ${frame === f.id ? "border-primary bg-muted/20" : "border-border/50"}`}
                                        onClick={() => setFrame(f.id)}
                                    >
                                        <div className="w-full aspect-square flex items-center justify-center bg-gray-50/80 rounded border text-gray-400">
                                            {/* Preview placeholder */}
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
                                <Label>Color del QR</Label>
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
                                <Label>Color de Fondo</Label>
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
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
