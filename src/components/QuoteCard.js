"use client";

import { Button } from "@/components/Button";
import { H3 } from "@/components/typography/H3";
import { H6 } from "@/components/typography/H6";
import { EmojiButton } from "./EmojiButton";
import { useContext } from "react";
import { QuotesContext } from "@/app/QuotesContext";

export function QuoteCard() {
  const {
    quotes,
    quoteIndex,
    handleQuoteIndexUpdate,
    handleLikeQuote,
    likedQuotes,
    handleRemoveLike,
    unlikedQuotes,
    handleUnlikeQuote,
  } = useContext(QuotesContext);
  const { quote, author, likeCount, unlikeCount } = quotes[quoteIndex];

  return (
    <section className="flex flex-col gap-2 bg-slate-50/80 rounded-md p-10 shadow-lg">
      <div className="flex place-items-end">
        <EmojiButton
          symbol="👎"
          counter={unlikeCount}
          onClick={handleUnlikeQuote}
        />

        <EmojiButton symbol="♡" counter={likeCount} onClick={handleLikeQuote} />
      </div>

      <H3 element="h3">{quote}</H3>
      <H6> {`- ${author}`} </H6>
      <div className="flex flex-col mt-6">
        <Button variant={"primary"} onClick={handleQuoteIndexUpdate}>
          {" "}
          Next Quote{" "}
        </Button>
      </div>
    </section>
  );
}
