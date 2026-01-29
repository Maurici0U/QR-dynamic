import { QRCodeSVG } from "qrcode.react"
import { QR_FRAMES } from "./definitions"

interface QRFrameProps {
    frameId?: string
    slug: string
    origin: string
    design?: string // JSON string
    size?: number
    className?: string
    id?: string // Passing ID to the SVG for download
}

export function QRFrame({ frameId = "none", slug, origin, design, size = 150, className, id }: QRFrameProps) {
    const frame = QR_FRAMES[frameId] || QR_FRAMES.none
    const parsedDesign = JSON.parse(design || "{}")
    const fgColor = parsedDesign.fgColor || "#000000"
    const bgColor = parsedDesign.bgColor || "#ffffff"

    if (frame.id === "none") {
        return (
            <QRCodeSVG
                id={id}
                value={`${origin}/q/${slug}`}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                className={className}
            />
        )
    }

    // ViewBox handling
    // The frame has a native viewBox. We want to scale our content (QR) into it.
    // SVG composition:
    // <svg viewBox={frame.viewBox} color={fgColor}>
    //    {frame.path}
    //    <foreignObject? No, nested SVG for QR>
    //    <svg x={offset} y={offset} width={size*scale} ... > <QRCode /> </svg>
    // </svg>

    const [vbx, vby, vbw, vbh] = frame.viewBox.split(" ").map(Number)

    // We need to render the QRCode content. QRCodeSVG returns an SVG element.
    // To make it composable inside another SVG, we can't easily nest "QRCodeSVG" directly if it renders a root <svg>.
    // However, HTML5 allows nested SVGs.

    // We will render a wrapper SVG with the frame's viewBox.
    // Inside, we render the frame path.
    // Then we render the QR code positioned correctly.

    // The QRCodeSVG component from 'qrcode.react' renders an <svg> tag.
    // We can wrap it in a <g> transform or nested <svg>.

    const qrSize = vbw * frame.contentScale

    return (
        <svg
            id={id}
            viewBox={frame.viewBox}
            width={size}
            height={size * (vbh / vbw)} // Maintain aspect ratio of the frame
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: fgColor }} // Allow currentColor to work in frame
        >
            {/* Background for the whole frame if needed, or rely on frame path */}

            {/* Render Frame Path */}
            {frame.path(vbw, vbh)}

            {/* Render QR Code nested */}
            <svg
                x={frame.contentOffset.x}
                y={frame.contentOffset.y}
                width={qrSize}
                height={qrSize}
                viewBox={`0 0 ${qrSize} ${qrSize}`}
            >
                <QRCodeSVG
                    value={`${origin}/q/${slug}`}
                    size={qrSize}
                    fgColor={fgColor}
                    bgColor={bgColor}
                    marginSize={0} // No margin on the QR itself, handled by frame
                />
            </svg>
        </svg>
    )
}
