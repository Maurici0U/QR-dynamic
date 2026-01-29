export interface FrameDefinition {
    id: string;
    label: string;
    path: (width: number, height: number) => React.ReactNode;
    viewBox: string; // "0 0 200 200"
    contentOffset: { x: number, y: number }; // Offset for the QR code inside the frame
    contentScale: number; // Scale factor for the QR code to fit
}

export const QR_FRAMES: Record<string, FrameDefinition> = {
    none: {
        id: "none",
        label: "Ninguno",
        path: () => null,
        viewBox: "0 0 100 100",
        contentOffset: { x: 0, y: 0 },
        contentScale: 1
    },
    poster: {
        id: "poster",
        label: "Poster",
        viewBox: "0 0 100 120",
        contentOffset: { x: 10, y: 10 },
        contentScale: 0.8,
        path: (w, h) => (
            <>
                <rect x="0" y="0" width="100" height="120" rx="8" fill="currentColor" opacity="0.1" />
                <rect x="5" y="5" width="90" height="90" rx="4" fill="white" />
                <text x="50" y="110" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">ESCANÉAME</text>
            </>
        )
    },
    shop: {
        id: "shop",
        label: "Tienda",
        viewBox: "0 0 120 140",
        contentOffset: { x: 20, y: 35 },
        contentScale: 0.65,
        path: (w, h) => (
            <>
                <path d="M40,10 C40,5 45,0 60,0 C75,0 80,5 80,10 L100,20 L110,140 L10,140 L20,20 L40,10 Z" fill="currentColor" opacity="0.1" />
                {/* Handle */}
                <path d="M45,25 Q60,-10 75,25" fill="none" stroke="currentColor" strokeWidth="3" />
                <rect x="25" y="35" width="70" height="70" rx="2" fill="white" />
                <text x="60" y="125" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">NUEVA COLECCIÓN</text>
            </>
        )
    },
    cafe: {
        id: "cafe",
        label: "Café/Restaurante",
        viewBox: "0 0 120 130",
        contentOffset: { x: 15, y: 15 },
        contentScale: 0.75,
        path: (w, h) => (
            <>
                <rect x="5" y="5" width="110" height="120" rx="8" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M10,10 L110,10 L110,100 L10,100 Z" fill="white" />
                {/* Steam */}
                <path d="M40,-5 Q50,-15 40,-25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" transform="translate(10, 10)" />
                <path d="M60,-5 Q70,-15 60,-25" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" transform="translate(10, 8)" />
                <text x="60" y="118" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">MENÚ</text>
            </>
        )
    },
    sale: {
        id: "sale",
        label: "Oferta",
        viewBox: "0 0 130 130",
        contentOffset: { x: 25, y: 25 },
        contentScale: 0.6,
        path: (w, h) => (
            <>
                {/* Starburst shape */}
                <path d="M65,5 L75,25 L95,20 L95,40 L115,50 L105,70 L120,90 L95,95 L85,115 L65,105 L45,115 L35,95 L10,90 L25,70 L15,50 L35,40 L35,20 L55,25 Z" fill="currentColor" opacity="0.2" />
                <circle cx="65" cy="65" r="45" fill="white" stroke="currentColor" strokeWidth="2" />
                <text x="65" y="125" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">% OFERTA ESPECIAL %</text>
            </>
        )
    },
    fashion: {
        id: "fashion",
        label: "Moda",
        viewBox: "0 0 110 110",
        contentOffset: { x: 10, y: 10 },
        contentScale: 0.8,
        path: (w, h) => (
            <>
                <rect x="5" y="5" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" />
                <rect x="0" y="0" width="110" height="110" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="10, 5" />
                <rect x="15" y="15" width="80" height="80" fill="white" />
            </>
        )
    }
}
