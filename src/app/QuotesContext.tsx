"use client";

import { createContext, ReactNode, useState } from "react";
import { quotes as initialQuotes, type Quote } from "@/quotes";
import { getRandomNumber } from "../utils/helper-functions";
import { redirect } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import { useUser } from "@auth0/nextjs-auth0/client";

interface QuotesContextInterface {
  quotes: Quote[];
  quoteIndex: number;
  handleQuoteIndexUpdate: () => void;
  handleToggleLike: (targetIndex: number) => void;
  likedQuotes: Quote[];
}

const InitialQuotesContext = {
  quotes: [],
  quoteIndex: 0,

  handleQuoteIndexUpdate: () => console.log(""),
  handleToggleLike: () => console.log(""),
  likedQuotes: [],
};

export const QuotesContext =
  createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({ children }: { children: ReactNode }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const { user } = useUser();
  const likedQuotes = quotes.filter((quote) =>
    quote.likedBy?.includes(user?.sub ?? ""),
  );

  // Index Update
  function handleQuoteIndexUpdate() {
    let nextQuoteIndex: number;

    do {
      nextQuoteIndex = getRandomNumber({ min: 0, max: quotes.length });
    } while (nextQuoteIndex === quoteIndex);

    if (!isNaN(nextQuoteIndex)) {
      setQuoteIndex(nextQuoteIndex);
    }

    console.log("New index is:", nextQuoteIndex);
  }

  function handleToggleLike(targetIndex: number) {
    const userId = user?.sub;
    if (!userId) {

      redirect("/auth/login");

    }

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
  }

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        quoteIndex,
        handleQuoteIndexUpdate,
        handleToggleLike,
        likedQuotes,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
}
