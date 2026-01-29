import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadThing } from "../lib/uploadthing"

interface FileUploadProps {
    onUploadSuccess: (fileId: string, fileName: string) => void
    label?: string
}

export function FileUpload({ onUploadSuccess, label = "Subir Archivo" }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const { startUpload } = useUploadThing("fileUploader", {
        onClientUploadComplete: async (res) => {
            if (!res || res.length === 0) return
            const uploadedFile = res[0]

            // Save metadata to our DB
            try {
                const saveRes = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: uploadedFile.name,
                        url: uploadedFile.url,
                        size: uploadedFile.size,
                        type: file?.type
                    })
                })

                if (!saveRes.ok) throw new Error("Failed to save record")

                const data = await saveRes.json()
                onUploadSuccess(data.id, data.originalName)
                setFile(null)
            } catch (err) {
                console.error(err)
                alert("Error guardando el archivo en base de datos")
            } finally {
                setUploading(false)
            }
        },
        onUploadError: (error: Error) => {
            console.error(error)
            alert(`Error subiendo archivo: ${error.message}`)
            setUploading(false)
        },
    })

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const uploadFile = async () => {
        if (!file) return
        setUploading(true)
        // Start upload to Uploadthing
        await startUpload([file])
    }

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={inputRef}
                            className="hidden"
                            type="file"
                            onChange={handleChange}
                        />
                        <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">{label}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Arrastra o haz click</p>
                        <Button
                            variant="secondary"
                            className="mt-4"
                            onClick={() => inputRef.current?.click()}
                        >
                            Seleccionar
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center rounded-lg border p-6"
                    >
                        <div className="mb-4 flex items-center gap-2">
                            <div className="p-2 bg-muted rounded-full">
                                <Upload className="h-4 w-4" />
                            </div>
                            <div className="text-sm font-medium">{file.name}</div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto"
                                onClick={() => setFile(null)}
                                disabled={uploading}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button onClick={uploadFile} disabled={uploading} className="w-full">
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                "Confirmar Subida"
                            )}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


function FileTextIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    )
}
