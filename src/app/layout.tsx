import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Meteor Pro — Inventaire des Immobilisations d'Entreprise & QR Code",
  description: "Plateforme de gestion et d'inventaire d'immobilisations d'entreprise avec étiquettes QR codes physiques et fiches scannées mobile-first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 pb-16">{children}</main>
        </SessionProvider>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">Meteor Pro QR Assets</span>
              <span>—</span>
              <span>Plateforme Inventaire &amp; Immobilisations</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>PostgreSQL / Neon ready</span>
              <span>•</span>
              <span>Next.js 14 App Router</span>
              <span>•</span>
              <span>Mobile-First QR Architecture</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
