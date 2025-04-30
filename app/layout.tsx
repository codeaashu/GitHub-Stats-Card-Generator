import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToggleTheme } from "@/components/ToggleTheme";
import { Button } from "@/components/ui/button";
import { Github } from 'lucide-react';
import "./globals.css";

const monaSans = localFont({
  src: "./fonts/MonaSans-SemiBold.woff2",
  variable: "--font-mona-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GitHub Stats Card Generator",
  description: "A simple and customizable Github Stats Card generator.",
  icons: {
    icon: "/LOGO.png"
},
  openGraph: {
    title: "GitHub Stats Card Generator",
    description: "A simple and customizable Github Stats Card generator.",
    url: "https://github-stats-card-generator.vercel.app/",
    siteName: "GitHub Stats Card Generator",
    images: "/LOGO.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
            <head>
        <link rel="icon" href="/LOGO.png" type="image/png" />
      </head>
      <body className={`${monaSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex justify-end p-4 space-x-2">
            <Button variant="outline" size="icon" asChild>
              <a
                href="https://github.com/codeaashu/GitHub-Stats-Card-Generator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">GitHub repository</span>
              </a>
            </Button>
            <ToggleTheme />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
