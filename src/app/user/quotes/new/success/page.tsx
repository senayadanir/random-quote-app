"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function NewQuoteSuccessPage() {
  return (
    <main className=" min-h-[calc(100vh-130px)] flex-col justify-items-center pt-20 ">
      <div className="mt-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm transition-all animate-in fade-in slide-in-from-top-2 max-w-md w-full bg-primary/10 border-primary/20 text-primary">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
        <h1 className="leading-relaxed">Quote added successfully!</h1>
      </div>

      <div className="w-full max-w-md border border-primary/20 rounded-2xl mt-4 p-10 shadow-md bg-primary/10 text-primary items-center">
        <h1>
          Thank you adding a new quote. It&apos;s now sent to administator for
          review.
        </h1>
        <Button className="mt-10 ">
          <Link href="/user/quotes/new">Add another quote</Link>
        </Button>
      </div>
    </main>
  );
}
