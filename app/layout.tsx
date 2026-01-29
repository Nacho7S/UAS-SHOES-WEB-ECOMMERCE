import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {AuthProvider} from '../app/provider/authProvider'
import NavbarComponent from "../app/components/Navbar"
import {CartProvider} from '../app/provider/cartProvider'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHOESTORE",
  description: "WELCOME TO SHOESTORE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>           
            <NavbarComponent/>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
