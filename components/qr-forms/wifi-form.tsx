"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface WifiData {
    ssid: string;
    password: string;
    encryption: string;
}

interface WifiFormProps {
    data: WifiData;
    onChange: (data: WifiData) => void;
}

export function WifiForm({ data, onChange }: WifiFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Nombre de la Red (SSID)</Label>
                <Input
                    placeholder="MiCasa_5G"
                    value={data.ssid}
                    onChange={(e) => onChange({ ...data, ssid: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                    placeholder="********"
                    value={data.password}
                    onChange={(e) => onChange({ ...data, password: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Tipo de Seguridad</Label>
                <Select
                    value={data.encryption}
                    onValueChange={(value) => onChange({ ...data, encryption: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona seguridad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="WPA">WPA/WPA2</SelectItem>
                        <SelectItem value="WEP">WEP</SelectItem>
                        <SelectItem value="nopass">Sin Contraseña</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
