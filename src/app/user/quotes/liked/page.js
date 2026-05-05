"use client";

import { useContext } from "react";
import { H1 } from "../../../../components/typography/H1.js";
import { H3 } from "../../../../components/typography/H3.js";
import { H6 } from "../../../../components/typography/H6.js";
import { QuotesContext } from "../../../QuotesContext.js";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Heart, Trash2 } from "lucide-react";

export default function LikedQuotesPage() {
  const { likedQuotes, quotes, handleRemoveLike } = useContext(QuotesContext);

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4">
      <div className="mb-10 text-center">
        <H1 element="h1">Liked Quotes</H1>
        <p className="text-slate-500 mt-2 font-medium">
          Your curated collection of favorite insights.
        </p>
      </div>

      <section className="flex flex-col gap-8 w-full items-center max-w-xl">
        {likedQuotes.length > 0 ? (
          likedQuotes.map((quoteObj) => {
            const originalIndex = quotes.findIndex(
              (q) => q.quote === quoteObj.quote,
            );

            return (
              <Card
                key={originalIndex}
                size="lg"
                className="w-full shadow-md border-l-4 border-red-500/40"
              >
                <CardContent className="flex flex-col gap-2">
                  <div className="flex justify-end">
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-2 dark:bg-red-50/10 rounded-full">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold ">
                        {quoteObj.likeCount}
                      </span>
                    </div>
                  </div>

                  <H3 element="h3" className="text-current dark:text-white">
                    {quoteObj.quote}
                  </H3>

                  <H6 className="text-current dark:text-white italic">
                    {`- ${quoteObj.author}`}
                  </H6>

                  <div className="flex flex-col mt-6">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full border-none py-5 font-bold transform hover:scale-102 transition-all ease-out duration-300 rounded-lg shadow-sm"
                      onClick={() => handleRemoveLike(originalIndex)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove from Favorites
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 opacity-60">
            <p className="text-slate-500 italic text-lg">
              No favorites curated yet. <br />
              Start exploring to fill your collection!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
