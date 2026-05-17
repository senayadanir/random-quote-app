"use client";

import { QuoteCard } from "./QuoteCard";
import { useContext } from "react"; 
import { QuotesContext } from "./QuotesContext"; 

export default function Home() {
  const { quotes, quoteIndex, handleToggleLike, handleQuoteIndexUpdate } =
    useContext(QuotesContext);

  const { quote, author, isLiked } = quotes[quoteIndex];

  return (
    <main className="min-h-screen flex text-slate-900 dark:text-slate-100 items-center justify-center">
      <QuoteCard
        quote={quote}
        author={author}
        isLiked={isLiked}
        handleToggleLike={() => handleToggleLike(quoteIndex)}
        handleQuoteIndexUpdate={handleQuoteIndexUpdate}
      />
    </main>
  );
}
