import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuotesContextProvider } from "@/app/QuotesContext";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <nav className="bg-slate-50/80  ">
        <ul className="flex justify-between max-w-2xl w-full p-4 mx-auto">
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/user/quotes/liked"}>Liked Quotes</Link>
          </li>
          <li>
            <Link href={"/user/quotes/unliked"}>Unliked Quotes</Link>
          </li>
        </ul>
      </nav>
      <QuotesContextProvider>
        <body className="min-h-full flex flex-col">{children}</body>
      </QuotesContextProvider>
    </html>
  );
}
