"use client";

import { createContext, useState } from "react";
import { quotes as initialQuotes, type Quote } from "@/quotes";
import { getRandomNumber } from "../utils/helper-functions";

interface QuotesContextInterface {
  quotes: Quote[];
  quoteIndex: number;
  handleQuoteIndexUpdate: () => void;
  handleToggleLike: (targetIndex: number) => void;
  likedQuotes: Quote[]
}

const InitialQuotesContext = {
  quotes: [],
  quoteIndex: 0,
  handleQuoteIndexUpdate: () => console.log(''),
  handleToggleLike: () => console.log(''),
  likedQuotes:[]
}

export const QuotesContext = createContext<QuotesContextInterface>(InitialQuotesContext);

export function QuotesContextProvider({ children }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState(initialQuotes);
  const likedQuotes = quotes.filter((quote) => quote.isLiked === true);

  // Index Update
  function handleQuoteIndexUpdate() {
    let nextQuoteIndex;

    do {
      nextQuoteIndex = getRandomNumber(0, quotes.length);
    } while (nextQuoteIndex === quoteIndex);

    if (!isNaN(nextQuoteIndex)) {
      setQuoteIndex(nextQuoteIndex);
    }

    console.log("New index is:", nextQuoteIndex);
  }

  function handleToggleLike(targetIndex) {
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
