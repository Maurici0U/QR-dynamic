"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    linkId: string | null
    linkTitle: string
}

export function AnalyticsModal({ isOpen, onClose, linkId, linkTitle }: AnalyticsModalProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && linkId) {
            setLoading(true)
            fetch(`/api/link/${linkId}/stats`)
                .then(res => res.json())
                .then(data => {
                    setData(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error(err)
                    setLoading(false)
                })
        }
    }, [isOpen, linkId])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Estadísticas de {linkTitle}</DialogTitle>
                    <DialogDescription>
                        Historial de escaneos en los últimos días.
                    </DialogDescription>
                </DialogHeader>

                <div className="h-[300px] w-full mt-4">
                    {loading ? (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            Cargando datos...
                        </div>
                    ) : data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="scans" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No hay datos de escaneos aún.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
