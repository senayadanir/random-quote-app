import {
  Geist,
  Geist_Mono,
  Inter,
  Nunito,
  Source_Code_Pro,
} from "next/font/google";
import "./globals.css";
import { QuotesContextProvider } from "@/app/QuotesContext";
import { NavbarMenu } from "./NavbarMenu";
import { ThemeProvider } from "./ThemeProvider";
import { Heart } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata = {
  title: "Random Quotes App",
  description: "Random Quotes Application 170426",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${nunito.variable} ${sourceCodePro.variable} h-full antialiased `}
    >
      <body
        className="min-h-full flex flex-col "
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QuotesContextProvider>
            <NavbarMenu />
            {children}
          </QuotesContextProvider>

          <footer className="border-t border-border/50 mt-auto py-6 text-center">
            <p className="text-xs text-muted-foreground">
              Made with
              <Heart
                size={10}
                className="inline text-destructive fill-destructive mx-0.5"
              />
              by
              <span className="font-semibold text-primary">
                {" Random Quote App "}
              </span>
              · {new Date().getFullYear()}
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
