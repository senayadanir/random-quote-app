"use client";

import { useContext } from "react";
import { H1 } from "@/components/typography/H1";
import { QuotesContext } from "@/app/QuotesContext";
import { LikedQuoteCard } from "@/components/LikedQuoteCard";

export default function LikedQuotesPage() {
  const { likedQuotes, quotes, handleRemoveLike } = useContext(QuotesContext);

  return (
    <main className="min-h-screen flex flex-col text-slate-900 items-center justify-center bg-slate-200">
      <div className="p-6">
        <H1 element="h1"> Liked Quotes </H1>
      </div>
      <section className="flex flex-col gap-6 w-full items-center">
        {likedQuotes.length > 0 ? (
          <div className="flex flex-col gap-6 w-full items-center">
            {likedQuotes.map((quote) => {
              const originalIndex = quotes.findIndex(
                (q) => q.quote === quote.quote,
              );
              return (
                <LikedQuoteCard
                  key={originalIndex}
                  quoteObj={quote}
                  onRemove={() => handleRemoveLike(originalIndex)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500">There is no liked quotes yet.</p>
        )}
      </section>
    </main>
  );
}
