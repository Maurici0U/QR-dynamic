"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface SocialData {
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
}

interface SocialFormProps {
    data: SocialData;
    onChange: (data: SocialData) => void;
}

export function SocialForm({ data, onChange }: SocialFormProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Instagram URL</Label>
                <Input
                    placeholder="https://instagram.com/tu_usuario"
                    value={data.instagram}
                    onChange={(e) => onChange({ ...data, instagram: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Facebook URL</Label>
                <Input
                    placeholder="https://facebook.com/tu_usuario"
                    value={data.facebook}
                    onChange={(e) => onChange({ ...data, facebook: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>Twitter/X URL</Label>
                <Input
                    placeholder="https://x.com/tu_usuario"
                    value={data.twitter}
                    onChange={(e) => onChange({ ...data, twitter: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                    placeholder="https://linkedin.com/in/tu_usuario"
                    value={data.linkedin}
                    onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
                />
            </div>
        </div>
    )
}
