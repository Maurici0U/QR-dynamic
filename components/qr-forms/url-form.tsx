"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface UrlFormProps {
    data: string;
    onChange: (data: string) => void;
}

export function UrlForm({ data, onChange }: UrlFormProps) {
    return (
        <div className="space-y-4">
            <Label>URL del Sitio Web</Label>
            <Input
                placeholder="https://tu-sitio.com"
                value={data}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}
