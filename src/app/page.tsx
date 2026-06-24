"use client";

import { QuoteCard } from "./QuoteCard";
import { useContext } from "react";
import { QuotesContext } from "./QuotesContext";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Home() {
  const {
    quotes,
    quoteIndex,
    isLoading,
    error,
    handleToggleLike,
    handleQuoteIndexUpdate,
  } = useContext(QuotesContext);
  const { user } = useUser();

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            Loading quotes...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const currentQuote = (quotes ?? [])[quoteIndex];
  if (!currentQuote) {
    return (
      <main className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            No quotes yet. Add one or approve quotes in the database.
          </p>
        </div>
      </main>
    );
  }

  // const { quote, author, likedBy } = currentQuote;

  // const isLiked =
  //   Array.isArray(likedBy) && typeof user?.sub === "string"
  //     ? likedBy.includes(user.sub)
  //     : false;

  return (
    <main className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
          Daily Inspiration
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-tight">
          Words that move&nbsp;
          <span className="text-primary relative">
            you
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-primary/30" />
          </span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Discover handpicked quotes to ignite your day — save the ones that
          resonate.
        </p>
      </div>
      <QuoteCard
        quoteItem={quotes[quoteIndex]}
        quoteIndex={quoteIndex}
        userSub={user?.sub}
        handleToggleLike={handleToggleLike}
        handleQuoteIndexUpdate={handleQuoteIndexUpdate}
      />
      {!user && (
        <p className="mt-8 text-xs text-muted-foreground text-center">
          <Link
            href="/api/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </Link>{" "}
          to save your favorites and add your own quotes.
        </p>
      )}
    </main>
  );
}
