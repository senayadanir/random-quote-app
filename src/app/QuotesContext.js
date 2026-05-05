"use client";

import { createContext, useState } from "react";
import { quotes as initialQuotes } from "../quotes.js";
import { getRandomNumber } from "../utils/helper-functions.js";

export const QuotesContext = createContext({});

export function QuotesContextProvider({ children }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState(initialQuotes);
  const likedQuotes = quotes.filter((quote) => quote.likeCount > 0);
  const unlikedQuotes = quotes.filter((quote) => quote.unlikeCount > 0);

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

  // Liked Quotes Update

  function handleLikeQuote() {
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === quoteIndex) {
        const updatedLikeCount =
          typeof quote.likeCount === "number" ? quote.likeCount + 1 : 1;
        return { ...quote, likeCount: updatedLikeCount };
      }
      return quote;
    });

    setQuotes(updatedQuotes);
  }

  function handleRemoveLike(targetIndex) {
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === targetIndex) {
        return { ...quote, likeCount: 0 };
      }
      return quote;
    });

    setQuotes(updatedQuotes);
  }

  function handleUnlikeQuote() {
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === quoteIndex) {
        const updatedUnlikeCount =
          typeof quote.unlikeCount === "number" ? quote.unlikeCount + 1 : 1;
        return { ...quote, unlikeCount: updatedUnlikeCount };
      }
      return quote;
    });
    setQuotes(updatedQuotes);
  }

  function handleRemoveUnlike(targetIndex) {
    const updatedQuotes = quotes.map((quote, id) => {
      if (id === targetIndex) {
        return { ...quote, unlikeCount: 0 };
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
        handleLikeQuote,
        likedQuotes,
        handleRemoveLike,
        unlikedQuotes,
        handleUnlikeQuote,
        handleRemoveUnlike,
      }}
    >
      {children}
    </QuotesContext.Provider>
  );
}
