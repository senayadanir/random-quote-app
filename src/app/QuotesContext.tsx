"use client";

import { createContext, ReactNode, useState } from "react";
import { quotes as initialQuotes, type Quote } from "@/quotes";
import { getRandomNumber } from "../utils/helper-functions";
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
  const likedQuotes = quotes.filter((quote) => quote.isLiked === true);

  // Index Update
  function handleQuoteIndexUpdate() {
    let nextQuoteIndex: number;

    do {
      nextQuoteIndex = getRandomNumber(0, quotes.length);
    } while (nextQuoteIndex === quoteIndex);

    if (!isNaN(nextQuoteIndex)) {
      setQuoteIndex(nextQuoteIndex);
    }

    console.log("New index is:", nextQuoteIndex);
  }

  function handleToggleLike(targetIndex: number) {
    if (!user) {
      console.log("User not authenticated");
      window.location.assign("/auth/login");
      return;
    }

    const updatedQuotes = quotes.map((quote, id) => {
      if (id === targetIndex) {
        return { ...quote, isLiked: !quote.isLiked };
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
