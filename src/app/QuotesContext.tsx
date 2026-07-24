"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { getRandomNumber } from "../utils/helper-functions";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TQuote, QuotesContextInterface } from "@/types/quotes";

const InitialQuotesContext = {
  quotes: [],
  quoteIndex: 0,
  isLoading: true,
  error: null,
  handleQuoteIndexUpdate: () => console.log(""),
  handleToggleLike: () => console.log(""),
  handleDeleteQuote: async () => false,
  handleEditQuote: async () => false,
  likedQuotes: [],
};

export const QuotesContext =
  createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<TQuote[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/quotes`);
        if (!response.ok) {
          throw new Error("Failed to load quotes");
        }

        const data = await response.json();
        const quotesData = Array.isArray(data) ? data : data.quotes || [];
        setQuotes(quotesData);
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

    if (!userId) return;
    const quoteId = String(targetQuote._id);
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
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("[DATABASE_LIKE_UPDATE_FAILURE]:", error);
      setQuotes(previousQuotes);
    }
  }

  async function handleDeleteQuote(targetIndex: number): Promise<boolean> {
    const targetQuote = quotes[targetIndex];
    const userId = user?.sub;

    if (!userId || targetQuote.createdBy !== userId) {
      return false;
    }

    const quoteId = String(targetQuote._id);
    const previousQuotes = [...quotes];
    const updatedQuotes = quotes.filter((_, id) => id !== targetIndex);
    setQuotes(updatedQuotes);
    setQuoteIndex(0);

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("[DATABASE_QUOTE_DELETE_FAILURE]:", error);
      setQuotes(previousQuotes);
      setQuoteIndex(targetIndex);
      return false;
    }
  }

  async function handleEditQuote(
    targetIndex: number,
    newQuote: string,
    newAuthor: string,
    newCategory: string,
  ): Promise<boolean> {
    const targetQuote = quotes[targetIndex];
    const userId = user?.sub;

    if (!userId || targetQuote.createdBy !== userId) {
      return false;
    }

    const quoteId = String(targetQuote._id);
    const previousQuotes = [...quotes];

    const updatedQuotes = quotes.filter((_, id) => id !== targetIndex);
    setQuotes(updatedQuotes);
    setQuoteIndex(0);

    try {
      const response = await fetch(`/api/quotes/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: newQuote,
          author: newAuthor,
          category: newCategory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("[DATABASE_QUOTE_EDIT_FAILURE]:", error);
      setQuotes(previousQuotes);
      setQuoteIndex(targetIndex);
      return false;
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
        handleDeleteQuote,
        handleEditQuote,
        likedQuotes,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
}
