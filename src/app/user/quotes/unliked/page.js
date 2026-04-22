"use client";

import { useContext } from "react";
import { H1 } from "@/components/typography/H1";
import { QuotesContext } from "@/app/QuotesContext";
import { UnlikedQuoteCard } from "@/components/UnlikedQuoteCard";

export default function LikedQuotesPage() {
  const { unlikedQuotes, quotes, handleRemoveLike } = useContext(QuotesContext);

  return (
    <main className="min-h-screen flex flex-col text-slate-900 items-center justify-center bg-slate-200">
      <div className="p-6">
        <H1 element="h1"> Unliked Quotes </H1>
      </div>
      <section className="flex flex-col gap-6 w-full items-center">
        {unlikedQuotes.length > 0 ? (
          <div className="flex flex-col gap-6 w-full items-center">
            {unlikedQuotes.map((quote) => {
              const originalIndex = quotes.findIndex(
                (q) => q.quote === quote.quote,
              );
              return (
                <UnlikedQuoteCard
                  key={originalIndex}
                  quoteObj={quote}
                  onRemove={() => handleRemoveLike(originalIndex)}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500">There is no unliked quotes yet.</p>
        )}
      </section>
    </main>
  );
}
