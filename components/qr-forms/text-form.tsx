"use client"

import { Label } from "@/components/ui/label"

interface TextFormProps {
    data: string;
    onChange: (data: string) => void;
}

export function TextForm({ data, onChange }: TextFormProps) {
    return (
        <div className="space-y-4">
            <Label>Contenido del Texto</Label>
            <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Escribe tu mensaje aquí..."
                value={data}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}
