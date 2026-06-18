import type { Metadata } from "next";
import StoreProvider from "@/lib/store-provider";
import "./globals.css";
import AuthListener from "@/components/AuthListener";

export const metadata: Metadata = {
  title: "Summarist Home Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthListener>{children}</AuthListener>
        </StoreProvider>
      </body>
    </html>
  );
}
