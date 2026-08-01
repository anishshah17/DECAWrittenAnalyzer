import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "DECA Draftroom", description: "A focused writing coach for DECA prepared events." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
