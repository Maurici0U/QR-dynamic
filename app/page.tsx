import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center px-4 lg:px-6 border-b">
        <Link className="flex items-center justify-center gap-2 font-bold text-lg" href="/">
          <QrCode className="h-6 w-6" />
          <span>Dynamic QR</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost">Iniciar Sesión</Button>
          </Link>
          <Link href="/register">
            <Button>Regístrate</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Tus Archivos, <span className="text-primary">QR Dinámicos</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium">
                  Sube archivos, genera un código QR y actualiza el contenido las veces que quieras sin reimprimir el código. Ideal para menús, catálogos y documentos vivos.
                </p>
              </div>
              <div className="flex flex-col w-full max-w-sm gap-4 sm:flex-row sm:justify-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full text-lg h-12">Comenzar Gratis</Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-lg h-12">
                    Acceder a mi cuenta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start p-6 rounded-lg border bg-card">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">QR Permanente</h3>
                <p className="text-muted-foreground">El diseño del QR nunca cambia. Actualiza el archivo al que apunta en segundos.</p>
              </div>
              <div className="flex flex-col items-center md:items-start p-6 rounded-lg border bg-card">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Sube lo que sea</h3>
                <p className="text-muted-foreground">Soporte para PDF, Imágenes, Documentos y más. Gestión simple e intuitiva.</p>
              </div>
              <div className="flex flex-col items-center md:items-start p-6 rounded-lg border bg-card">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Multiusuario</h3>
                <p className="text-muted-foreground">Cada usuario tiene su propio panel privado para gestionar sus archivos y códigos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-auto text-sm text-muted-foreground">
        <p>
          © 2025 Dynamic QR. Hecho con Next.js 16.
        </p>
      </footer>
    </div>
  )
}
