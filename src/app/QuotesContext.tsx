"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
// import { quotes as initialQuotes } from "@/quotes";
import { getRandomNumber } from "../utils/helper-functions";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TQuote } from "@/types/quotes";
import { QuotesContextInterface } from "@/types/quotes";

const InitialQuotesContext = {
  quotes: [],
  quoteIndex: 0,
  isLoading: true,
  error: null,
  handleQuoteIndexUpdate: () => console.log(""),
  handleToggleLike: () => console.log(""),
  likedQuotes: [],
};

export const QuotesContext =
  createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<TQuote[]>([]); //initialQuotes in the beggining

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/quotes");
        if (!response.ok) {
          throw new Error("Failed to load quotes");
        }

        const data = await response.json();
        setQuotes(data.quotes);
        setQuoteIndex(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quotes");
        setQuotes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []); // if you use empty array as a secont parameter, it means that you fetch data just one time.

  // Index Update
  function handleQuoteIndexUpdate() {
    if (quotes.length <= 1) {
      console.log("Not enough quotes to change index.");
      return;
    }

    let nextQuoteIndex: number;
    do {
      nextQuoteIndex = getRandomNumber({ min: 0, max: quotes.length - 1 });
    } while (nextQuoteIndex === quoteIndex);

    if (!isNaN(nextQuoteIndex)) {
      setQuoteIndex(nextQuoteIndex);
    }
    // console.log("New index is:", nextQuoteIndex);
  }

  async function handleToggleLike(targetIndex: number) {
    const targetQuote = quotes[targetIndex];
    const userId = user?.sub;
    if (!userId) {
      redirect("/auth/login");
    }
    const previousQuotes = [...quotes];
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === targetIndex) {
        const currentLikedBy = Array.isArray(quote.likedBy)
          ? [...quote.likedBy]
          : [];
        const isAlreadyLiked = currentLikedBy.includes(userId);
        const newLikedBy = isAlreadyLiked
          ? currentLikedBy.filter((id) => id !== userId)
          : [...currentLikedBy, userId];

        return { ...quote, likedBy: newLikedBy };
      }
      return quote;
    });

    setQuotes(updatedQuotes);

    try {
      const response = await fetch("/api/quotes/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId: targetQuote._id }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("[DATABASE_LIKE_UPDATE_FAILURE]:", error);
      setQuotes(previousQuotes);
    }
  }

  const likedQuotes = Array.isArray(quotes)
    ? quotes.filter((quote) => quote.likedBy?.includes(user?.sub ?? ""))
    : [];

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        quoteIndex,
        isLoading,
        error,
        handleQuoteIndexUpdate,
        handleToggleLike,
        likedQuotes,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
}
