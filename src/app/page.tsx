"use client";

import { QuoteCard } from "./QuoteCard";
import { useContext } from "react";
import { QuotesContext } from "./QuotesContext";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  const { quotes, quoteIndex, handleToggleLike, handleQuoteIndexUpdate } =
    useContext(QuotesContext);

  const { user } = useUser();

  const currentQuote = quotes[quoteIndex];
  if (!currentQuote) return null;

  const { quote, author, likedBy } = currentQuote;

  const isLiked =
    Array.isArray(likedBy) && typeof user?.sub === "string"
      ? likedBy.includes(user.sub)
      : false;

  return (
    <main className="min-h-screen flex text-slate-900 dark:text-slate-100 items-center justify-center">
      <QuoteCard
        quote={quote}
        author={author}
        isLiked={isLiked}
        quoteIndex={quoteIndex}
        handleToggleLike={() => handleToggleLike(quoteIndex)}
        handleQuoteIndexUpdate={handleQuoteIndexUpdate}
      />
    </main>
  );
}
