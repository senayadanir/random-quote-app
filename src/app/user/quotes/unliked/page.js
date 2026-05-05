"use client";

import { useContext } from "react";
import { H1 } from "../../../../components/typography/H1.js";
import { H3 } from "../../../../components/typography/H3.js";
import { H6 } from "../../../../components/typography/H6.js";
import { QuotesContext } from "../../../QuotesContext.js";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { HeartOff, Undo2 } from "lucide-react";
import { cn } from "../../../../lib/utils.js";

export default function UnlikedQuotesPage() {
  const { unlikedQuotes, quotes, handleRemoveUnlike } =
    useContext(QuotesContext);

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 transition-colors duration-300">
      <div className="mb-10 text-center">
        <H1 element="h1">Unliked Quotes</H1>
        <p className="text-muted-foreground mt-2 font-medium">
          Sometimes wisdom needs a second look. Review your unliked quotes here.
        </p>
      </div>

      <section className="flex flex-col gap-8 w-full items-center max-w-xl">
        {unlikedQuotes.length > 0 ? (
          unlikedQuotes.map((quoteObj) => {
            const originalIndex = quotes.findIndex(
              (q) => q.quote === quoteObj.quote,
            );

            return (
              <Card
                key={originalIndex}
                size="lg"
                className="w-full shadow-md border-l-4 border-amber-500/40"
              >
                <CardContent className="flex flex-col gap-2">
                  <div className="flex justify-end">
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-full border border-amber-100/50">
                      <HeartOff className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold">
                        {quoteObj.unlikeCount}
                      </span>
                    </div>
                  </div>

                  <H3 element="h3" className=" text-foreground leading-relaxed">
                    {quoteObj.quote}
                  </H3>

                  <H6 className="text-current dark:text-white italic">
                    {`- ${quoteObj.author}`}
                  </H6>

                  <div className="flex flex-col mt-6">
                    <Button
                      size="sm"
                      className={cn(
                        "w-full border-none py-5 font-bold transform hover:scale-102 transition-all ease-out duration-300 rounded-lg shadow-sm",
                        "bg-amber-500/50 hover:bg-amber-700/50 text-foreground flex items-center justify-center gap-2 group",
                      )}
                      onClick={() => handleRemoveUnlike(originalIndex)}
                    >
                      <Undo2 className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Reconsider this Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-24 opacity-60">
            <p className="text-slate-500 italic text-lg">
              The archive is currently empty. <br />
              All perspectives are finding their place!
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
