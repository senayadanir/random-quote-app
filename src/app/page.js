"use client";

// import { QuoteCardComponent } from "@/components/QuoteCardComponent";
import { QuoteCard } from "./QuoteCard";
import { useContext } from "react"; //
import { QuotesContext } from "./QuotesContext"; //

export default function Home() {
  const {
    quotes,
    quoteIndex,
    handleLikeQuote,
    handleUnlikeQuote,
    handleQuoteIndexUpdate,
  } = useContext(QuotesContext);

  const { quote, author, likeCount, unlikeCount } = quotes[quoteIndex];

  return (
    <main className="min-h-screen flex text-slate-900 dark:text-slate-100 items-center justify-center">
      {/* <QuoteCardComponent /> */}
      <QuoteCard
        quote={quote}
        author={author}
        likeCount={likeCount}
        unlikeCount={unlikeCount}
        handleLikeQuote={handleLikeQuote}
        handleUnlikeQuote={handleUnlikeQuote}
        handleQuoteIndexUpdate={handleQuoteIndexUpdate}
      />
    </main>
  );
}
