"use client";

import { quotes as initialQuotes } from "@/quotes";
import { Button } from "@/components/Button";
import { H3 } from "@/components/typography/H3";
import { H6 } from "@/components/typography/H6";
import { useState } from "react";
import { getRandomNumber } from "@/utils/helper-functions";
import { LikeButton } from "./LikeButton";

export function QuoteCard() {
  const [quotes, setQuotes] = useState(
    initialQuotes.map((quote) => ({ ...quote, likes: quote.likeCount || 0 })),
  );
  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = quotes[quoteIndex];

  function handleClick() {
    let nextQuoteIndex;

    do {
      nextQuoteIndex = getRandomNumber(0, initialQuotes.length);
    } while (nextQuoteIndex === quoteIndex);

    if (!isNaN(nextQuoteIndex)) {
      setQuoteIndex(nextQuoteIndex);
    }

    console.log("New index is:", nextQuoteIndex);
  }

  function increaseNumber() {
    const updatedQuotes = [...quotes];
    updatedQuotes[quoteIndex].likes += 1;
    setQuotes(updatedQuotes);
  }

  return (
    <section className="flex flex-col gap-2 bg-slate-50/50 rounded-md p-10 shadow-lg">
      <div className="place-items-end">
        <LikeButton
          symbol="♡"
          counter={currentQuote.likes}
          onClick={increaseNumber}
        />
      </div>

      <H3 element="h3">{currentQuote.quote}</H3>
      <H6> {`- ${currentQuote.author}`} </H6>
      <div className="flex flex-col mt-6">
        <Button variant={"primary"} onClick={handleClick}>
          {" "}
          Next Quote{" "}
        </Button>
      </div>
    </section>
  );
}
