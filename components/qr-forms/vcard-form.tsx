"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface VCardData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    website: string;
}

interface VCardFormProps {
    data: VCardData;
    onChange: (data: VCardData) => void;
}

export function VCardForm({ data, onChange }: VCardFormProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                        placeholder="Juan"
                        value={data.firstName}
                        onChange={(e) => onChange({ ...data, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Apellido</Label>
                    <Input
                        placeholder="Pérez"
                        value={data.lastName}
                        onChange={(e) => onChange({ ...data, lastName: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                    placeholder="+54 9 11..."
                    value={data.phone}
                    onChange={(e) => onChange({ ...data, phone: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input
                    placeholder="juan@email.com"
                    value={data.email}
                    onChange={(e) => onChange({ ...data, email: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Sitio Web</Label>
                <Input
                    placeholder="https://misitio.com"
                    value={data.website}
                    onChange={(e) => onChange({ ...data, website: e.target.value })}
                />
            </div>
        </div>
    )
}
