"use client";

import { H3 } from "@/components/typography/H3";
import { H6 } from "@/components/typography/H6";
import { Button } from "@/components/Button";

export function UnlikedQuoteCard({ quoteObj, onRemove }) {
  const { quote, author, likeCount, unlikeCount } = quoteObj;

  return (
    <section className="flex flex-col gap-2 bg-slate-50/80 rounded-md p-10 shadow-lg w-full max-w-2xl">
      <div className="place-items-end">
        <div className="flex items-center gap-2 p-2">
          <span className="text-xl text-red-500">👎</span>
          <span className="text-slate-600 font-bold">{unlikeCount}</span>
        </div>
      </div>

      <H3 element="h3">{quote}</H3>
      <H6> {`- ${author}`} </H6>

      <div className="flex flex-col mt-6">
        <Button variant="primary" onClick={onRemove}>
          Remove from Favorites
        </Button>
      </div>
    </section>
  );
}
